
module App

open System
open Browser
open Browser.Types
open Fable.Core
open Fable.Core.JsInterop
open Feliz

// ─────────────────────────────────────────────
// DOMAIN TYPES
// ─────────────────────────────────────────────

type TransactionKind = Income | Expense

type Category =
    | Food | Transport | Housing | Entertainment
    | Healthcare | Shopping | Education | Salary
    | Freelance | Investment | Other

let allCategories = [
    Food; Transport; Housing; Entertainment
    Healthcare; Shopping; Education; Salary
    Freelance; Investment; Other
]

let categoryLabel = function
    | Food          -> "🍔 Food"
    | Transport     -> "🚌 Transport"
    | Housing       -> "🏠 Housing"
    | Entertainment -> "🎮 Entertainment"
    | Healthcare    -> "💊 Healthcare"
    | Shopping      -> "🛍 Shopping"
    | Education     -> "📚 Education"
    | Salary        -> "💼 Salary"
    | Freelance     -> "💻 Freelance"
    | Investment    -> "📈 Investment"
    | Other         -> "📦 Other"

let categoryFromString (s: string) : Category =
    match s with
    | "Food"          -> Food
    | "Transport"     -> Transport
    | "Housing"       -> Housing
    | "Entertainment" -> Entertainment
    | "Healthcare"    -> Healthcare
    | "Shopping"      -> Shopping
    | "Education"     -> Education
    | "Salary"        -> Salary
    | "Freelance"     -> Freelance
    | "Investment"    -> Investment
    | _               -> Other

let categoryToString = function
    | Food          -> "Food"
    | Transport     -> "Transport"
    | Housing       -> "Housing"
    | Entertainment -> "Entertainment"
    | Healthcare    -> "Healthcare"
    | Shopping      -> "Shopping"
    | Education     -> "Education"
    | Salary        -> "Salary"
    | Freelance     -> "Freelance"
    | Investment    -> "Investment"
    | Other         -> "Other"

type Transaction = {
    Id          : string
    Date        : string
    Description : string
    Amount      : float
    Kind        : string
    Category    : string
}

type AppView = Dashboard | AddNew | History | Analytics

// ─────────────────────────────────────────────
// LOCAL STORAGE
// ─────────────────────────────────────────────

let private storageKey = "snapbudget_v2"

let saveTransactions (txns: Transaction list) : unit =
    let json = JS.JSON.stringify (Array.ofList txns)
    window.localStorage.setItem(storageKey, json)

let loadTransactions () : Transaction list =
    let raw = window.localStorage.getItem(storageKey)
    if isNull raw then []
    else
        try
            let arr : Transaction array = JS.JSON.parse(raw) |> unbox
            Array.toList arr
        with _ -> []

// ─────────────────────────────────────────────
// HELPER FUNCTIONS
// ─────────────────────────────────────────────

let newId () : string =
    sprintf "%f-%i" (JS.Math.random()) (System.DateTime.Now.Millisecond)

let todayStr () : string =
    let now = System.DateTime.Now
    sprintf "%04i-%02i-%02i" now.Year now.Month now.Day

let getMonth (dateStr: string) : int =
    try
        let parts = dateStr.Split('-')
        int parts.[1]
    with _ -> 0

let getYear (dateStr: string) : int =
    try
        let parts = dateStr.Split('-')
        int parts.[0]
    with _ -> 0

let totalByKind (kind: string) (txns: Transaction list) : float =
    txns
    |> List.filter (fun t -> t.Kind = kind)
    |> List.sumBy (fun t -> t.Amount)

let spendingByCategory (txns: Transaction list) =
    txns
    |> List.filter (fun t -> t.Kind = "expense")
    |> List.groupBy (fun t -> t.Category)
    |> List.map (fun (cat, ts) -> cat, ts |> List.sumBy (fun t -> t.Amount))
    |> List.sortByDescending snd

let exportCSV (txns: Transaction list) : unit =
    let header = "Date,Description,Category,Type,Amount"
    let rows =
        txns
        |> List.sortByDescending (fun t -> t.Date)
        |> List.map (fun t ->
            sprintf "%s,\"%s\",%s,%s,%.2f" t.Date t.Description t.Category t.Kind t.Amount)
    let csv = String.concat "\n" (header :: rows)
    
    // 使用emit直接嵌入JavaScript代码
    emitJsStatement () """
const blob = new Blob([$0], {type: 'text/csv'});
const url = URL.createObjectURL(blob);
const a = document.createElement('a');
a.href = url;
a.download = 'snapbudget_export.csv';
a.click();
URL.revokeObjectURL(url);
""" csv

// ─────────────────────────────────────────────
// REACT COMPONENTS
// ─────────────────────────────────────────────

[<ReactComponent>]
let NavBar (currentView: AppView) (onNavigate: AppView -> unit) =
    let navBtn (label: string) (view: AppView) =
        Html.button [
            prop.className (if currentView = view then "nav-btn active" else "nav-btn")
            prop.text label
            prop.onClick (fun _ -> onNavigate view)
        ]
    Html.nav [
        prop.className "navbar"
        prop.children [
            Html.div [ prop.className "nav-brand"; prop.text "💰 SnapBudget" ]
            Html.div [
                prop.className "nav-links"
                prop.children [
                    navBtn "Dashboard" Dashboard
                    navBtn "Add" AddNew
                    navBtn "History" History
                    navBtn "Analytics" Analytics
                ]
            ]
        ]
    ]

[<ReactComponent>]
let SummaryCard (label: string) (amount: float) (color: string) =
    Html.div [
        prop.className "summary-card"
        prop.style [ style.borderTop(3, borderStyle.solid, color) ]
        prop.children [
            Html.p [ prop.className "card-label"; prop.text label ]
            Html.p [ prop.className "card-amount"; prop.text (sprintf "$ %.2f" amount) ]
        ]
    ]

[<ReactComponent>]
let TransactionRow (txn: Transaction) (onDelete: string -> unit) (confirmId: string) (onConfirm: string -> unit) (onCancel: unit -> unit) =
    let kindClass = if txn.Kind = "income" then "txn-amount income" else "txn-amount expense"
    let sign = if txn.Kind = "income" then "+" else "-"
    Html.div [
        prop.children [
            Html.div [
                prop.className "txn-row"
                prop.children [
                    Html.span [ prop.className "txn-date"; prop.text txn.Date ]
                    Html.span [ prop.className "txn-desc"; prop.text txn.Description ]
                    Html.span [ prop.className "txn-cat"; prop.text (categoryLabel (categoryFromString txn.Category)) ]
                    Html.span [ prop.className kindClass; prop.text (sprintf "%s$ %.2f" sign txn.Amount) ]
                    Html.button [
                        prop.className "delete-btn"
                        prop.text "🗑"
                        prop.onClick (fun _ -> onConfirm txn.Id)
                    ]
                ]
            ]
            if confirmId = txn.Id then
                Html.div [
                    prop.className "confirm-row"
                    prop.children [
                        Html.span [ prop.text "Delete this transaction?" ]
                        Html.button [
                            prop.className "confirm-yes"
                            prop.text "Yes"
                            prop.onClick (fun _ -> onDelete txn.Id)
                        ]
                        Html.button [
                            prop.className "confirm-no"
                            prop.text "Cancel"
                            prop.onClick (fun _ -> onCancel())
                        ]
                    ]
                ]
        ]
    ]

[<ReactComponent>]
let DashboardView (transactions: Transaction list) =
    let income = totalByKind "income" transactions
    let expense = totalByKind "expense" transactions
    let balance = income - expense
    let recent =
        transactions
        |> List.sortByDescending (fun t -> t.Date)
        |> List.truncate 5
    Html.div [
        prop.className "view-container"
        prop.children [
            Html.h2 [ prop.text "📊 Dashboard" ]
            Html.div [
                prop.className "summary-row"
                prop.children [
                    SummaryCard "Balance" balance "#4CAF50"
                    SummaryCard "Income" income "#2196F3"
                    SummaryCard "Expenses" expense "#f44336"
                ]
            ]
            Html.div [
                prop.className "recent-section"
                prop.children [
                    Html.h3 [ prop.text "Recent Transactions" ]
                    if List.isEmpty recent then
                        Html.p [ prop.className "empty-msg"; prop.text "No transactions yet. Add your first one!" ]
                    else
                        for txn in recent do
                            let kindClass = if txn.Kind = "income" then "txn-amount income" else "txn-amount expense"
                            let sign = if txn.Kind = "income" then "+" else "-"
                            Html.div [
                                prop.className "txn-row"
                                prop.children [
                                    Html.span [ prop.className "txn-date"; prop.text txn.Date ]
                                    Html.span [ prop.className "txn-desc"; prop.text txn.Description ]
                                    Html.span [ prop.className "txn-cat"; prop.text (categoryLabel (categoryFromString txn.Category)) ]
                                    Html.span [ prop.className kindClass; prop.text (sprintf "%s$ %.2f" sign txn.Amount) ]
                                ]
                            ]
                ]
            ]
        ]
    ]

[<ReactComponent>]
let AddNewView (onAdd: Transaction -> unit) =
    let (desc, setDesc) = React.useState("")
    let (amount, setAmount) = React.useState("")
    let (kind, setKind) = React.useState("expense")
    let (category, setCategory) = React.useState("Food")
    let (date, setDate) = React.useState(todayStr())
    let (error, setError) = React.useState("")
    let (success, setSuccess) = React.useState("")

    let handleSubmit () =
        if String.IsNullOrWhiteSpace desc then
            setError "Description cannot be empty."
        else
            let parsed =
                try Some (float amount)
                with _ -> None
            match parsed with
            | None -> setError "Please enter a valid amount."
            | Some amt when amt <= 0.0 -> setError "Amount must be greater than 0."
            | Some amt ->
                let txn : Transaction = {
                    Id          = newId()
                    Date        = date
                    Description = desc.Trim()
                    Amount      = amt
                    Kind        = kind
                    Category    = category
                }
                onAdd txn
                setDesc ""
                setAmount ""
                setError ""
                setSuccess "Transaction added! ✅"

    Html.div [
        prop.className "view-container"
        prop.children [
            Html.h2 [ prop.text "➕ Add Transaction" ]
            if success <> "" then
                Html.div [
                    prop.className "success-banner"
                    prop.children [
                        Html.span [ prop.text success ]
                        Html.button [ prop.text "✕"; prop.onClick (fun _ -> setSuccess "") ]
                    ]
                ]
            Html.div [
                prop.className "form-group"
                prop.children [
                    Html.label [ prop.text "Type" ]
                    Html.div [
                        prop.className "toggle-row"
                        prop.children [
                            Html.button [
                                prop.className (if kind = "expense" then "toggle-btn active-exp" else "toggle-btn")
                                prop.text "Expense"
                                prop.onClick (fun _ -> setKind "expense")
                            ]
                            Html.button [
                                prop.className (if kind = "income" then "toggle-btn active-inc" else "toggle-btn")
                                prop.text "Income"
                                prop.onClick (fun _ -> setKind "income")
                            ]
                        ]
                    ]
                ]
            ]
            Html.div [
                prop.className "form-group"
                prop.children [
                    Html.label [ prop.text "Description" ]
                    Html.input [
                        prop.type' "text"
                        prop.placeholder "e.g. Coffee, Rent, Paycheck..."
                        prop.value desc
                        prop.onChange (fun (s: string) -> setDesc s)
                    ]
                ]
            ]
            Html.div [
                prop.className "form-group"
                prop.children [
                    Html.label [ prop.text "Amount ($)" ]
                    Html.input [
                        prop.type' "number"
                        prop.placeholder "0.00"
                        prop.value amount
                        prop.onChange (fun (s: string) -> setAmount s)
                    ]
                ]
            ]
            Html.div [
                prop.className "form-group"
                prop.children [
                    Html.label [ prop.text "Category" ]
                    Html.select [
                        prop.value category
                        prop.onChange (fun (s: string) -> setCategory s)
                        prop.children [
                            for cat in allCategories do
                                Html.option [
                                    prop.value (categoryToString cat)
                                    prop.text (categoryLabel cat)
                                ]
                        ]
                    ]
                ]
            ]
            Html.div [
                prop.className "form-group"
                prop.children [
                    Html.label [ prop.text "Date" ]
                    Html.input [
                        prop.type' "date"
                        prop.value date
                        prop.onChange (fun (s: string) -> setDate s)
                    ]
                ]
            ]
            if error <> "" then
                Html.p [ prop.className "error-msg"; prop.text error ]
            Html.button [
                prop.className "submit-btn"
                prop.text "Add Transaction"
                prop.onClick (fun _ -> handleSubmit())
            ]
        ]
    ]

[<ReactComponent>]
let HistoryView (transactions: Transaction list) (onDelete: string -> unit) =
    let now = System.DateTime.Now
    let (filterMonth, setFilterMonth) = React.useState(now.Month)
    let (filterYear, setFilterYear) = React.useState(now.Year)
    let (confirmId, setConfirmId) = React.useState("")

    let filtered =
        transactions
        |> List.filter (fun t ->
            if filterMonth = 0 then true
            else getMonth t.Date = filterMonth && getYear t.Date = filterYear)
        |> List.sortByDescending (fun t -> t.Date)

    Html.div [
        prop.className "view-container"
        prop.children [
            Html.h2 [ prop.text "📋 History" ]
            Html.div [
                prop.className "filter-row"
                prop.children [
                    Html.select [
                        prop.value (string filterMonth)
                        prop.onChange (fun (s: string) -> setFilterMonth (int s))
                        prop.children [
                            Html.option [ prop.value "0"; prop.text "All months" ]
                            for m in 1..12 do
                                let names = [| "January"; "February"; "March"; "April"; "May"; "June"
                                               "July"; "August"; "September"; "October"; "November"; "December" |]
                                Html.option [ prop.value (string m); prop.text names.[m - 1] ]
                        ]
                    ]
                    Html.select [
                        prop.value (string filterYear)
                        prop.onChange (fun (s: string) -> setFilterYear (int s))
                        prop.children [
                            let curYear = now.Year
                            for y in (curYear - 3)..curYear do
                                Html.option [ prop.value (string y); prop.text (string y) ]
                        ]
                    ]
                    Html.button [
                        prop.className "export-btn"
                        prop.text "⬇ Export CSV"
                        prop.onClick (fun _ -> exportCSV transactions)
                    ]
                ]
            ]
            if List.isEmpty filtered then
                Html.p [ prop.className "empty-msg"; prop.text "No transactions match your filter." ]
            else
                Html.div [
                    prop.className "txn-list"
                    prop.children [
                        for txn in filtered do
                            TransactionRow txn onDelete confirmId
                                (fun id -> setConfirmId id)
                                (fun () -> setConfirmId "")
                    ]
                ]
        ]
    ]

[<ReactComponent>]
let AnalyticsView (transactions: Transaction list) =
    let bycat = spendingByCategory transactions
    let maxAmt =
        match bycat with
        | (_, v) :: _ -> v
        | [] -> 1.0
    Html.div [
        prop.className "view-container"
        prop.children [
            Html.h2 [ prop.text "📈 Analytics" ]
            Html.p [ prop.text (sprintf "Total transactions on record: %i" (List.length transactions)) ]
            Html.h3 [ prop.text "Spending by Category" ]
            if List.isEmpty bycat then
                Html.p [ prop.className "empty-msg"; prop.text "No expense data to show." ]
            else
                Html.div [
                    prop.className "bar-chart"
                    prop.children [
                        for (cat, amt) in bycat do
                            let pct = int (amt / maxAmt * 100.0)
                            Html.div [
                                prop.className "bar-row"
                                prop.children [
                                    Html.span [ prop.className "bar-label"; prop.text (categoryLabel (categoryFromString cat)) ]
                                    Html.div [
                                        prop.className "bar-track"
                                        prop.children [
                                            Html.div [
                                                prop.className "bar-fill"
                                                prop.style [ style.width (length.percent pct) ]
                                            ]
                                        ]
                                    ]
                                    Html.span [ prop.className "bar-value"; prop.text (sprintf "$ %.2f" amt) ]
                                ]
                            ]
                    ]
                ]
        ]
    ]

// ─────────────────────────────────────────────
// MAIN APP COMPONENT
// ─────────────────────────────────────────────

[<ReactComponent>]
let App () =
    let (currentView, setCurrentView) = React.useState(Dashboard)
    let (transactions, setTransactions) = React.useState(loadTransactions())

    let addTransaction (txn: Transaction) =
        let updated = txn :: transactions
        saveTransactions updated
        setTransactions updated

    let deleteTransaction (id: string) =
        let updated = transactions |> List.filter (fun t -> t.Id <> id)
        saveTransactions updated
        setTransactions updated

    Html.div [
        prop.className "app"
        prop.children [
            NavBar currentView setCurrentView
            Html.main [
                prop.className "main-content"
                prop.children [
                    match currentView with
                    | Dashboard -> DashboardView transactions
                    | AddNew    -> AddNewView addTransaction
                    | History   -> HistoryView transactions deleteTransaction
                    | Analytics -> AnalyticsView transactions
                ]
            ]
            Html.footer [
                prop.className "footer"
                prop.text "SnapBudget · Your data lives in your browser · No accounts, no tracking"
            ]
        ]
    ]

// ─────────────────────────────────────────────
// MOUNT TO DOM
// ─────────────────────────────────────────────

open Browser.Dom

let root = document.getElementById("app")
let reactRoot = ReactDOM.render(App(), root)
