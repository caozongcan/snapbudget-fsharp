import { Record, Union } from "../fable_modules/fable-library-js.4.21.0/Types.js";
import { record_type, float64_type, string_type, union_type } from "../fable_modules/fable-library-js.4.21.0/Reflection.js";
import { length, head, isEmpty, truncate, singleton as singleton_1, cons, map, sortByDescending, filter, sumBy, empty, toArray, ofArray } from "../fable_modules/fable-library-js.4.21.0/List.js";
import { day, month, year, now as now_1, millisecond } from "../fable_modules/fable-library-js.4.21.0/Date.js";
import { isNullOrWhiteSpace, join, split, printf, toText } from "../fable_modules/fable-library-js.4.21.0/String.js";
import { parse } from "../fable_modules/fable-library-js.4.21.0/Int32.js";
import { item } from "../fable_modules/fable-library-js.4.21.0/Array.js";
import { List_groupBy } from "../fable_modules/fable-library-js.4.21.0/Seq2.js";
import { int32ToString, createObj, equals, comparePrimitives, stringHash } from "../fable_modules/fable-library-js.4.21.0/Util.js";
import { createElement } from "react";
import React from "react";
import { reactApi } from "../fable_modules/Feliz.2.9.0/./Interop.fs.js";
import { map as map_1, collect, empty as empty_1, singleton, append, delay, toList } from "../fable_modules/fable-library-js.4.21.0/Seq.js";
import { parse as parse_1 } from "../fable_modules/fable-library-js.4.21.0/Double.js";
import { rangeDouble } from "../fable_modules/fable-library-js.4.21.0/Range.js";
import { render } from "react-dom";

export class TransactionKind extends Union {
    constructor(tag, fields) {
        super();
        this.tag = tag;
        this.fields = fields;
    }
    cases() {
        return ["Income", "Expense"];
    }
}

export function TransactionKind_$reflection() {
    return union_type("App.TransactionKind", [], TransactionKind, () => [[], []]);
}

export class Category extends Union {
    constructor(tag, fields) {
        super();
        this.tag = tag;
        this.fields = fields;
    }
    cases() {
        return ["Food", "Transport", "Housing", "Entertainment", "Healthcare", "Shopping", "Education", "Salary", "Freelance", "Investment", "Other"];
    }
}

export function Category_$reflection() {
    return union_type("App.Category", [], Category, () => [[], [], [], [], [], [], [], [], [], [], []]);
}

export const allCategories = ofArray([new Category(0, []), new Category(1, []), new Category(2, []), new Category(3, []), new Category(4, []), new Category(5, []), new Category(6, []), new Category(7, []), new Category(8, []), new Category(9, []), new Category(10, [])]);

export function categoryLabel(_arg) {
    switch (_arg.tag) {
        case 1:
            return "🚌 Transport";
        case 2:
            return "🏠 Housing";
        case 3:
            return "🎮 Entertainment";
        case 4:
            return "💊 Healthcare";
        case 5:
            return "🛍 Shopping";
        case 6:
            return "📚 Education";
        case 7:
            return "💼 Salary";
        case 8:
            return "💻 Freelance";
        case 9:
            return "📈 Investment";
        case 10:
            return "📦 Other";
        default:
            return "🍔 Food";
    }
}

export function categoryFromString(s) {
    switch (s) {
        case "Food":
            return new Category(0, []);
        case "Transport":
            return new Category(1, []);
        case "Housing":
            return new Category(2, []);
        case "Entertainment":
            return new Category(3, []);
        case "Healthcare":
            return new Category(4, []);
        case "Shopping":
            return new Category(5, []);
        case "Education":
            return new Category(6, []);
        case "Salary":
            return new Category(7, []);
        case "Freelance":
            return new Category(8, []);
        case "Investment":
            return new Category(9, []);
        default:
            return new Category(10, []);
    }
}

export function categoryToString(_arg) {
    switch (_arg.tag) {
        case 1:
            return "Transport";
        case 2:
            return "Housing";
        case 3:
            return "Entertainment";
        case 4:
            return "Healthcare";
        case 5:
            return "Shopping";
        case 6:
            return "Education";
        case 7:
            return "Salary";
        case 8:
            return "Freelance";
        case 9:
            return "Investment";
        case 10:
            return "Other";
        default:
            return "Food";
    }
}

export class Transaction extends Record {
    constructor(Id, Date$, Description, Amount, Kind, Category) {
        super();
        this.Id = Id;
        this.Date = Date$;
        this.Description = Description;
        this.Amount = Amount;
        this.Kind = Kind;
        this.Category = Category;
    }
}

export function Transaction_$reflection() {
    return record_type("App.Transaction", [], Transaction, () => [["Id", string_type], ["Date", string_type], ["Description", string_type], ["Amount", float64_type], ["Kind", string_type], ["Category", string_type]]);
}

export class AppView extends Union {
    constructor(tag, fields) {
        super();
        this.tag = tag;
        this.fields = fields;
    }
    cases() {
        return ["Dashboard", "AddNew", "History", "Analytics"];
    }
}

export function AppView_$reflection() {
    return union_type("App.AppView", [], AppView, () => [[], [], [], []]);
}

const storageKey = "snapbudget_v2";

export function saveTransactions(txns) {
    const json = JSON.stringify(toArray(txns));
    window.localStorage.setItem(storageKey, json);
}

export function loadTransactions() {
    const raw = window.localStorage.getItem(storageKey);
    if (raw == null) {
        return empty();
    }
    else {
        try {
            const arr = JSON.parse(raw);
            return ofArray(arr);
        }
        catch (matchValue) {
            return empty();
        }
    }
}

export function newId() {
    const arg = Math.random();
    const arg_1 = millisecond(now_1()) | 0;
    return toText(printf("%f-%i"))(arg)(arg_1);
}

export function todayStr() {
    const now = now_1();
    const arg = year(now) | 0;
    const arg_1 = month(now) | 0;
    const arg_2 = day(now) | 0;
    return toText(printf("%04i-%02i-%02i"))(arg)(arg_1)(arg_2);
}

export function getMonth(dateStr) {
    try {
        const parts = split(dateStr, ["-"], undefined, 0);
        return parse(item(1, parts), 511, false, 32) | 0;
    }
    catch (matchValue) {
        return 0;
    }
}

export function getYear(dateStr) {
    try {
        const parts = split(dateStr, ["-"], undefined, 0);
        return parse(item(0, parts), 511, false, 32) | 0;
    }
    catch (matchValue) {
        return 0;
    }
}

export function totalByKind(kind, txns) {
    return sumBy((t_1) => t_1.Amount, filter((t) => (t.Kind === kind), txns), {
        GetZero: () => 0,
        Add: (x, y) => (x + y),
    });
}

export function spendingByCategory(txns) {
    return sortByDescending((tuple) => tuple[1], map((tupledArg) => {
        const cat = tupledArg[0];
        const ts = tupledArg[1];
        return [cat, sumBy((t_2) => t_2.Amount, ts, {
            GetZero: () => 0,
            Add: (x_1, y_1) => (x_1 + y_1),
        })];
    }, List_groupBy((t_1) => t_1.Category, filter((t) => (t.Kind === "expense"), txns), {
        Equals: (x, y) => (x === y),
        GetHashCode: stringHash,
    })), {
        Compare: comparePrimitives,
    });
}

export function exportCSV(txns) {
    const header = "Date,Description,Category,Type,Amount";
    const rows = map((t_1) => toText(printf("%s,\"%s\",%s,%s,%.2f"))(t_1.Date)(t_1.Description)(t_1.Category)(t_1.Kind)(t_1.Amount), sortByDescending((t) => t.Date, txns, {
        Compare: comparePrimitives,
    }));
    const csv = join("\n", cons(header, rows));
    const blob = new Blob([undefined], {type: 'text/csv'});
const url = URL.createObjectURL(blob);
const a = document.createElement('a');
a.href = url;
a.download = 'snapbudget_export.csv';
a.click();
URL.revokeObjectURL(url);
;
    throw 1;
}

export function NavBar(navBarInputProps) {
    let elems_1, elems;
    const onNavigate = navBarInputProps.onNavigate;
    const currentView = navBarInputProps.currentView;
    const navBtn = (label, view) => createElement("button", {
        className: equals(currentView, view) ? "nav-btn active" : "nav-btn",
        children: label,
        onClick: (_arg) => {
            onNavigate(view);
        },
    });
    return createElement("nav", createObj(ofArray([["className", "navbar"], (elems_1 = [createElement("div", {
        className: "nav-brand",
        children: "💰 SnapBudget",
    }), createElement("div", createObj(ofArray([["className", "nav-links"], (elems = [navBtn("Dashboard", new AppView(0, [])), navBtn("Add", new AppView(1, [])), navBtn("History", new AppView(2, [])), navBtn("Analytics", new AppView(3, []))], ["children", reactApi.Children.toArray(Array.from(elems))])])))], ["children", reactApi.Children.toArray(Array.from(elems_1))])])));
}

export function SummaryCard(summaryCardInputProps) {
    let elems;
    const color = summaryCardInputProps.color;
    const amount = summaryCardInputProps.amount;
    const label = summaryCardInputProps.label;
    return createElement("div", createObj(ofArray([["className", "summary-card"], ["style", {
        borderTop: (((3 + "px ") + "solid") + " ") + color,
    }], (elems = [createElement("p", {
        className: "card-label",
        children: label,
    }), createElement("p", {
        className: "card-amount",
        children: toText(printf("$ %.2f"))(amount),
    })], ["children", reactApi.Children.toArray(Array.from(elems))])])));
}

export function TransactionRow(transactionRowInputProps) {
    let elems_2;
    const onCancel = transactionRowInputProps.onCancel;
    const onConfirm = transactionRowInputProps.onConfirm;
    const confirmId = transactionRowInputProps.confirmId;
    const onDelete = transactionRowInputProps.onDelete;
    const txn = transactionRowInputProps.txn;
    const kindClass = (txn.Kind === "income") ? "txn-amount income" : "txn-amount expense";
    const sign = (txn.Kind === "income") ? "+" : "-";
    return createElement("div", createObj(singleton_1((elems_2 = toList(delay(() => {
        let elems;
        return append(singleton(createElement("div", createObj(ofArray([["className", "txn-row"], (elems = [createElement("span", {
            className: "txn-date",
            children: txn.Date,
        }), createElement("span", {
            className: "txn-desc",
            children: txn.Description,
        }), createElement("span", {
            className: "txn-cat",
            children: categoryLabel(categoryFromString(txn.Category)),
        }), createElement("span", {
            className: kindClass,
            children: toText(printf("%s$ %.2f"))(sign)(txn.Amount),
        }), createElement("button", {
            className: "delete-btn",
            children: "🗑",
            onClick: (_arg) => {
                onConfirm(txn.Id);
            },
        })], ["children", reactApi.Children.toArray(Array.from(elems))])])))), delay(() => {
            let elems_1;
            return (confirmId === txn.Id) ? singleton(createElement("div", createObj(ofArray([["className", "confirm-row"], (elems_1 = [createElement("span", {
                children: "Delete this transaction?",
            }), createElement("button", {
                className: "confirm-yes",
                children: "Yes",
                onClick: (_arg_1) => {
                    onDelete(txn.Id);
                },
            }), createElement("button", {
                className: "confirm-no",
                children: "Cancel",
                onClick: (_arg_2) => {
                    onCancel();
                },
            })], ["children", reactApi.Children.toArray(Array.from(elems_1))])])))) : empty_1();
        }));
    })), ["children", reactApi.Children.toArray(Array.from(elems_2))]))));
}

export function DashboardView(dashboardViewInputProps) {
    let elems_3, elems, elems_2;
    const transactions = dashboardViewInputProps.transactions;
    const income = totalByKind("income", transactions);
    const expense = totalByKind("expense", transactions);
    const balance = income - expense;
    const recent = truncate(5, sortByDescending((t) => t.Date, transactions, {
        Compare: comparePrimitives,
    }));
    return createElement("div", createObj(ofArray([["className", "view-container"], (elems_3 = [createElement("h2", {
        children: "📊 Dashboard",
    }), createElement("div", createObj(ofArray([["className", "summary-row"], (elems = [createElement(SummaryCard, {
        label: "Balance",
        amount: balance,
        color: "#4CAF50",
    }), createElement(SummaryCard, {
        label: "Income",
        amount: income,
        color: "#2196F3",
    }), createElement(SummaryCard, {
        label: "Expenses",
        amount: expense,
        color: "#f44336",
    })], ["children", reactApi.Children.toArray(Array.from(elems))])]))), createElement("div", createObj(ofArray([["className", "recent-section"], (elems_2 = toList(delay(() => append(singleton(createElement("h3", {
        children: "Recent Transactions",
    })), delay(() => (isEmpty(recent) ? singleton(createElement("p", {
        className: "empty-msg",
        children: "No transactions yet. Add your first one!",
    })) : collect((txn) => {
        let elems_1;
        const kindClass = (txn.Kind === "income") ? "txn-amount income" : "txn-amount expense";
        const sign = (txn.Kind === "income") ? "+" : "-";
        return singleton(createElement("div", createObj(ofArray([["className", "txn-row"], (elems_1 = [createElement("span", {
            className: "txn-date",
            children: txn.Date,
        }), createElement("span", {
            className: "txn-desc",
            children: txn.Description,
        }), createElement("span", {
            className: "txn-cat",
            children: categoryLabel(categoryFromString(txn.Category)),
        }), createElement("span", {
            className: kindClass,
            children: toText(printf("%s$ %.2f"))(sign)(txn.Amount),
        })], ["children", reactApi.Children.toArray(Array.from(elems_1))])]))));
    }, recent)))))), ["children", reactApi.Children.toArray(Array.from(elems_2))])])))], ["children", reactApi.Children.toArray(Array.from(elems_3))])])));
}

export function AddNewView(addNewViewInputProps) {
    let elems_8;
    const onAdd = addNewViewInputProps.onAdd;
    const patternInput = reactApi.useState("");
    const setDesc = patternInput[1];
    const desc = patternInput[0];
    const patternInput_1 = reactApi.useState("");
    const setAmount = patternInput_1[1];
    const amount = patternInput_1[0];
    const patternInput_2 = reactApi.useState("expense");
    const setKind = patternInput_2[1];
    const kind = patternInput_2[0];
    const patternInput_3 = reactApi.useState("Food");
    const setCategory = patternInput_3[1];
    const category = patternInput_3[0];
    let patternInput_4;
    const initial_4 = todayStr();
    patternInput_4 = reactApi.useState(initial_4);
    const setDate = patternInput_4[1];
    const date = patternInput_4[0];
    const patternInput_5 = reactApi.useState("");
    const setError = patternInput_5[1];
    const error = patternInput_5[0];
    const patternInput_6 = reactApi.useState("");
    const success = patternInput_6[0];
    const setSuccess = patternInput_6[1];
    const handleSubmit = () => {
        let amt;
        if (isNullOrWhiteSpace(desc)) {
            setError("Description cannot be empty.");
        }
        else {
            let parsed;
            try {
                parsed = parse_1(amount);
            }
            catch (matchValue) {
                parsed = undefined;
            }
            if (parsed != null) {
                if ((amt = parsed, amt <= 0)) {
                    const amt_1 = parsed;
                    setError("Amount must be greater than 0.");
                }
                else {
                    const amt_2 = parsed;
                    const txn = new Transaction(newId(), date, desc.trim(), amt_2, kind, category);
                    onAdd(txn);
                    setDesc("");
                    setAmount("");
                    setError("");
                    setSuccess("Transaction added! ✅");
                }
            }
            else {
                setError("Please enter a valid amount.");
            }
        }
    };
    return createElement("div", createObj(ofArray([["className", "view-container"], (elems_8 = toList(delay(() => append(singleton(createElement("h2", {
        children: "➕ Add Transaction",
    })), delay(() => {
        let elems;
        return append((success !== "") ? singleton(createElement("div", createObj(ofArray([["className", "success-banner"], (elems = [createElement("span", {
            children: success,
        }), createElement("button", {
            children: "✕",
            onClick: (_arg) => {
                setSuccess("");
            },
        })], ["children", reactApi.Children.toArray(Array.from(elems))])])))) : empty_1(), delay(() => {
            let elems_2, elems_1;
            return append(singleton(createElement("div", createObj(ofArray([["className", "form-group"], (elems_2 = [createElement("label", {
                children: "Type",
            }), createElement("div", createObj(ofArray([["className", "toggle-row"], (elems_1 = [createElement("button", {
                className: (kind === "expense") ? "toggle-btn active-exp" : "toggle-btn",
                children: "Expense",
                onClick: (_arg_1) => {
                    setKind("expense");
                },
            }), createElement("button", {
                className: (kind === "income") ? "toggle-btn active-inc" : "toggle-btn",
                children: "Income",
                onClick: (_arg_2) => {
                    setKind("income");
                },
            })], ["children", reactApi.Children.toArray(Array.from(elems_1))])])))], ["children", reactApi.Children.toArray(Array.from(elems_2))])])))), delay(() => {
                let elems_3;
                return append(singleton(createElement("div", createObj(ofArray([["className", "form-group"], (elems_3 = [createElement("label", {
                    children: "Description",
                }), createElement("input", {
                    type: "text",
                    placeholder: "e.g. Coffee, Rent, Paycheck...",
                    value: desc,
                    onChange: (ev) => {
                        setDesc(ev.target.value);
                    },
                })], ["children", reactApi.Children.toArray(Array.from(elems_3))])])))), delay(() => {
                    let elems_4;
                    return append(singleton(createElement("div", createObj(ofArray([["className", "form-group"], (elems_4 = [createElement("label", {
                        children: "Amount ($)",
                    }), createElement("input", {
                        type: "number",
                        placeholder: "0.00",
                        value: amount,
                        onChange: (ev_1) => {
                            setAmount(ev_1.target.value);
                        },
                    })], ["children", reactApi.Children.toArray(Array.from(elems_4))])])))), delay(() => {
                        let elems_6, elems_5;
                        return append(singleton(createElement("div", createObj(ofArray([["className", "form-group"], (elems_6 = [createElement("label", {
                            children: "Category",
                        }), createElement("select", createObj(ofArray([["value", category], ["onChange", (ev_2) => {
                            setCategory(ev_2.target.value);
                        }], (elems_5 = toList(delay(() => map_1((cat) => createElement("option", {
                            value: categoryToString(cat),
                            children: categoryLabel(cat),
                        }), allCategories))), ["children", reactApi.Children.toArray(Array.from(elems_5))])])))], ["children", reactApi.Children.toArray(Array.from(elems_6))])])))), delay(() => {
                            let elems_7;
                            return append(singleton(createElement("div", createObj(ofArray([["className", "form-group"], (elems_7 = [createElement("label", {
                                children: "Date",
                            }), createElement("input", {
                                type: "date",
                                value: date,
                                onChange: (ev_3) => {
                                    setDate(ev_3.target.value);
                                },
                            })], ["children", reactApi.Children.toArray(Array.from(elems_7))])])))), delay(() => append((error !== "") ? singleton(createElement("p", {
                                className: "error-msg",
                                children: error,
                            })) : empty_1(), delay(() => singleton(createElement("button", {
                                className: "submit-btn",
                                children: "Add Transaction",
                                onClick: (_arg_3) => {
                                    handleSubmit();
                                },
                            }))))));
                        }));
                    }));
                }));
            }));
        }));
    })))), ["children", reactApi.Children.toArray(Array.from(elems_8))])])));
}

export function HistoryView(historyViewInputProps) {
    let elems_4;
    const onDelete = historyViewInputProps.onDelete;
    const transactions = historyViewInputProps.transactions;
    const now = now_1();
    let patternInput;
    const initial = month(now) | 0;
    patternInput = reactApi.useState(initial);
    const setFilterMonth = patternInput[1];
    const filterMonth = patternInput[0] | 0;
    let patternInput_1;
    const initial_1 = year(now) | 0;
    patternInput_1 = reactApi.useState(initial_1);
    const setFilterYear = patternInput_1[1];
    const filterYear = patternInput_1[0] | 0;
    const patternInput_2 = reactApi.useState("");
    const setConfirmId = patternInput_2[1];
    const confirmId = patternInput_2[0];
    const filtered = sortByDescending((t_1) => t_1.Date, filter((t) => {
        if (filterMonth === 0) {
            return true;
        }
        else if (getMonth(t.Date) === filterMonth) {
            return getYear(t.Date) === filterYear;
        }
        else {
            return false;
        }
    }, transactions), {
        Compare: comparePrimitives,
    });
    return createElement("div", createObj(ofArray([["className", "view-container"], (elems_4 = toList(delay(() => append(singleton(createElement("h2", {
        children: "📋 History",
    })), delay(() => {
        let elems_2, elems, elems_1;
        return append(singleton(createElement("div", createObj(ofArray([["className", "filter-row"], (elems_2 = [createElement("select", createObj(ofArray([["value", int32ToString(filterMonth)], ["onChange", (ev) => {
            setFilterMonth(parse(ev.target.value, 511, false, 32));
        }], (elems = toList(delay(() => append(singleton(createElement("option", {
            value: "0",
            children: "All months",
        })), delay(() => collect((m) => {
            const names = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
            return singleton(createElement("option", {
                value: int32ToString(m),
                children: item(m - 1, names),
            }));
        }, rangeDouble(1, 1, 12)))))), ["children", reactApi.Children.toArray(Array.from(elems))])]))), createElement("select", createObj(ofArray([["value", int32ToString(filterYear)], ["onChange", (ev_1) => {
            setFilterYear(parse(ev_1.target.value, 511, false, 32));
        }], (elems_1 = toList(delay(() => {
            const curYear = year(now) | 0;
            return map_1((y_1) => createElement("option", {
                value: int32ToString(y_1),
                children: int32ToString(y_1),
            }), rangeDouble(curYear - 3, 1, curYear));
        })), ["children", reactApi.Children.toArray(Array.from(elems_1))])]))), createElement("button", {
            className: "export-btn",
            children: "⬇ Export CSV",
            onClick: (_arg) => {
                exportCSV(transactions);
            },
        })], ["children", reactApi.Children.toArray(Array.from(elems_2))])])))), delay(() => {
            let elems_3;
            return isEmpty(filtered) ? singleton(createElement("p", {
                className: "empty-msg",
                children: "No transactions match your filter.",
            })) : singleton(createElement("div", createObj(ofArray([["className", "txn-list"], (elems_3 = toList(delay(() => map_1((txn) => createElement(TransactionRow, {
                txn: txn,
                onDelete: onDelete,
                confirmId: confirmId,
                onConfirm: (id) => {
                    setConfirmId(id);
                },
                onCancel: () => {
                    setConfirmId("");
                },
            }), filtered))), ["children", reactApi.Children.toArray(Array.from(elems_3))])]))));
        }));
    })))), ["children", reactApi.Children.toArray(Array.from(elems_4))])])));
}

export function AnalyticsView(analyticsViewInputProps) {
    let elems_3;
    const transactions = analyticsViewInputProps.transactions;
    const bycat = spendingByCategory(transactions);
    let maxAmt;
    if (isEmpty(bycat)) {
        maxAmt = 1;
    }
    else {
        const v = head(bycat)[1];
        maxAmt = v;
    }
    return createElement("div", createObj(ofArray([["className", "view-container"], (elems_3 = toList(delay(() => append(singleton(createElement("h2", {
        children: "📈 Analytics",
    })), delay(() => {
        let arg;
        return append(singleton(createElement("p", {
            children: (arg = (length(transactions) | 0), toText(printf("Total transactions on record: %i"))(arg)),
        })), delay(() => append(singleton(createElement("h3", {
            children: "Spending by Category",
        })), delay(() => {
            let elems_2;
            return isEmpty(bycat) ? singleton(createElement("p", {
                className: "empty-msg",
                children: "No expense data to show.",
            })) : singleton(createElement("div", createObj(ofArray([["className", "bar-chart"], (elems_2 = toList(delay(() => collect((matchValue) => {
                let elems_1, elems;
                const cat = matchValue[0];
                const amt = matchValue[1];
                const pct = ~~((amt / maxAmt) * 100) | 0;
                return singleton(createElement("div", createObj(ofArray([["className", "bar-row"], (elems_1 = [createElement("span", {
                    className: "bar-label",
                    children: categoryLabel(categoryFromString(cat)),
                }), createElement("div", createObj(ofArray([["className", "bar-track"], (elems = [createElement("div", {
                    className: "bar-fill",
                    style: {
                        width: pct + "%",
                    },
                })], ["children", reactApi.Children.toArray(Array.from(elems))])]))), createElement("span", {
                    className: "bar-value",
                    children: toText(printf("$ %.2f"))(amt),
                })], ["children", reactApi.Children.toArray(Array.from(elems_1))])]))));
            }, bycat))), ["children", reactApi.Children.toArray(Array.from(elems_2))])]))));
        }))));
    })))), ["children", reactApi.Children.toArray(Array.from(elems_3))])])));
}

export function App() {
    let elems_1, elems;
    const patternInput = reactApi.useState(new AppView(0, []));
    const setCurrentView = patternInput[1];
    const currentView = patternInput[0];
    let patternInput_1;
    const initial_1 = loadTransactions();
    patternInput_1 = reactApi.useState(initial_1);
    const transactions = patternInput_1[0];
    const setTransactions = patternInput_1[1];
    const addTransaction = (txn) => {
        const updated = cons(txn, transactions);
        saveTransactions(updated);
        setTransactions(updated);
    };
    const deleteTransaction = (id) => {
        const updated_1 = filter((t) => (t.Id !== id), transactions);
        saveTransactions(updated_1);
        setTransactions(updated_1);
    };
    return createElement("div", createObj(ofArray([["className", "app"], (elems_1 = [createElement(NavBar, {
        currentView: currentView,
        onNavigate: setCurrentView,
    }), createElement("main", createObj(ofArray([["className", "main-content"], (elems = toList(delay(() => ((currentView.tag === 1) ? singleton(createElement(AddNewView, {
        onAdd: addTransaction,
    })) : ((currentView.tag === 2) ? singleton(createElement(HistoryView, {
        transactions: transactions,
        onDelete: deleteTransaction,
    })) : ((currentView.tag === 3) ? singleton(createElement(AnalyticsView, {
        transactions: transactions,
    })) : singleton(createElement(DashboardView, {
        transactions: transactions,
    }))))))), ["children", reactApi.Children.toArray(Array.from(elems))])]))), createElement("footer", {
        className: "footer",
        children: "SnapBudget · Your data lives in your browser · No accounts, no tracking",
    })], ["children", reactApi.Children.toArray(Array.from(elems_1))])])));
}

export const root = document.getElementById("app");

export const reactRoot = render(createElement(App, null), root);

