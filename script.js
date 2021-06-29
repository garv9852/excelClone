let defaultProperties = {
    text: "",
    "font-weight": "",
    "font-style": "",
    "text-decoration": "",
    "text-align": "left",
    "background-color": "#ffffff",
    "color": "#000000",
    "font-family": "Noto Sans",
    "font-size": "16px"
}

let cellData = {
    "Sheet1": {

    }
}

let selectedSheet = "Sheet1";
let totalSheets = 1;
let lastSheet = 1;
$(document).ready(function () {
    let cellContainer = $(".input-cell-container");
    for (let i = 1; i <= 100; i++) {
        let ans = "";
        let x = i;
        while (x > 0) {
            let r = x % 26;
            if (r == 0) {
                ans = "Z" + ans;
                x = Math.floor(x / 26) - 1;
            } else {
                ans = String.fromCharCode(r - 1 + 65) + ans;
                x = Math.floor(x / 26);
            }
        }


        let column = $(`<div class="column-name colId-${i}" id="colCod-${ans}">${ans}</div>`);
        $(".column-name-container").append(column);
        let row = $(`<div class="row-name" id="rowId-${i}">${i}</div>`);
        $(".row-name-container").append(row)
    }
    for (let i = 1; i <= 100; i++) {
        let row = $(`<div class="cell-row"></div>`);
        for (let j = 1; j <= 100; j++) {
            let colCode = $(`.colId-${j}`).attr("id").split("-")[1];
            let column = $(`<div class="input-cell" contenteditable="false" id="row-${i}-col-${j}" data="code-${colCode}"></div>`);
            row.append(column);
        }
        $(".input-cell-container").append(row);
    }




    $(".align-icon").click(function () {
        $(".align-icon.selected").removeClass("selected");
        $(this).addClass("selected");
    })

    $(".style-icon").click(function () {
        $(this).toggleClass("selected");
    })

    $(".input-cell-container").scroll(function () {
        $(".column-name-container").scrollLeft(this.scrollLeft);
    })
    $(".input-cell-container").scroll(function () {
        $(".row-name-container").scrollTop(this.scrollTop);
    })

    $(".input-cell").click(function (e) {
        if (e.ctrlKey) {
            let [rowid, colid] = getRowCol(this);
            if (rowid > 1) {
                let topcellselected = $(`#row-${rowid - 1}-col-${colid}`).hasClass("selected");
                if (topcellselected) {
                    $(this).addClass("top-cell-selected");
                    $(`#row-${rowid - 1}-col-${colid}`).addClass("bottom-cell-selected");
                }
            }
            if (rowid < 100) {
                let bottomcellselected = $(`#row-${rowid + 1}-col-${colid}`).hasClass("selected");
                if (bottomcellselected) {
                    $(this).addClass("bottom-cell-selected");
                    $(`#row-${rowid + 1}-col-${colid}`).addClass("top-cell-selected");
                }
            }
            if (colid > 1) {
                let leftcellselected = $(`#row-${rowid}-col-${colid - 1}`).hasClass("selected");
                if (leftcellselected) {
                    $(this).addClass("left-cell-selected");
                    $(`#row-${rowid}-col-${colid - 1}`).addClass("right-cell-selected");
                }
            }
            if (colid < 100) {
                let rightcellselected = $(`#row-${rowid}-col-${colid + 1}`).hasClass("selected");
                if (rightcellselected) {
                    $(this).addClass("right-cell-selected");
                    $(`#row-${rowid}-col-${colid + 1}`).addClass("left-cell-selected");
                }
            }
        } else {
            $(".input-cell.selected").removeClass("selected");
            $(".input-cell.top-cell-selected").removeClass("top-cell-selected");
            $(".input-cell.bottom-cell-selected").removeClass("bottom-cell-selected");
            $(".input-cell.right-cell-selected").removeClass("right-cell-selected");
            $(".input-cell.left-cell-selected").removeClass("left-cell-selected");
        }
        $(this).addClass("selected");
        changeHeader(this);
    });

    function changeHeader(ele) {
        let [rowId, colId] = getRowCol(ele);
        let cellInfo = defaultProperties;
        if (cellData[selectedSheet][rowId] && cellData[selectedSheet][rowId][colId]) {
            cellInfo = cellData[selectedSheet][rowId][colId];
        }
        cellInfo["font-weight"] ? $(".icon-bold").addClass("selected") : $(".icon-bold").removeClass("selected");
        cellInfo["font-style"] ? $(".icon-italic").addClass("selected") : $(".icon-italic").removeClass("selected");
        cellInfo["text-decoration"] ? $(".icon-underline").addClass("selected") : $(".icon-underline").removeClass("selected");
        let alignment = cellInfo["text-align"];
        $(".align-icon.selected").removeClass("selected");
        $(".icon-align-" + alignment).addClass("selected");
        $(".fill").val(cellInfo["background-color"]);
        $(".text").val(cellInfo["color"]);
        $(".font-family-selector").val(cellInfo["font-family"]);
        $(".font-family-selector").css("font-family", cellInfo["font-family"]);
        $(".font-size-selector").val(cellInfo["font-size"]);

    }

    $(".input-cell").dblclick(function () {
        $(".input-cell.selected").removeClass("selected");
        $(this).addClass("selected");
        $(this).attr("contenteditable", "true");
        $(this).focus();
    });
    $(".input-cell").blur(function () {
        updateCell("text", $(this).text());
        $(".input-cell").attr("contenteditable", "false");
    })
});

function getRowCol(e) {
    let id = $(e).attr("id").split("-");
    let rowid = parseInt(id[1]);
    let colid = parseInt(id[3]);
    return [rowid, colid];
}

function updateCell(property, value, defaultPossible) {
    $(".input-cell.selected").each(function () {
        $(this).css(property, value);

        let [rowid, colid] = getRowCol(this);
        if (cellData[selectedSheet][rowid]) {
            if (cellData[selectedSheet][rowid][colid]) {
                cellData[selectedSheet][rowid][colid][property] = value;
            } else {
                cellData[selectedSheet][rowid][colid] = {
                    ...defaultProperties
                };
                cellData[selectedSheet][rowid][colid][property] = value;
            }
        } else {
            cellData[selectedSheet][rowid] = {};
            cellData[selectedSheet][rowid][colid] = {
                ...defaultProperties
            };
            cellData[selectedSheet][rowid][colid][property] = value;
        }
        if (defaultPossible && JSON.stringify(cellData[selectedSheet][rowid][colid]) === JSON.stringify(defaultProperties)) {
            delete cellData[selectedSheet][rowid][colid];
            if (Object.keys(cellData[selectedSheet][rowid]).length == 0) {
                delete cellData[selectedSheet][rowid];
            }
        }
    });
    console.log(cellData);
}

$(".icon-bold").click(function () {
    if ($(this).hasClass("selected")) {
        updateCell("font-weight", "", true);
    } else {
        updateCell("font-weight", "bold", false);
    }
})

$(".icon-italic").click(function () {
    if ($(this).hasClass("selected")) {
        updateCell("font-style", "", true);
    } else {
        updateCell("font-style", "italic", false);
    }
})

$(".icon-underline").click(function () {
    if ($(this).hasClass("selected")) {
        updateCell("text-decoration", "", true);
    } else {
        updateCell("text-decoration", "underline", false);
    }
})

$(".icon-align-left").click(function () {
    if (!$(this).hasClass("selected")) {
        updateCell("text-align", "left", true);
    }
});
$(".icon-align-center").click(function () {
    if (!$(this).hasClass("selected")) {
        updateCell("text-align", "center", true);
    }
});
$(".icon-align-right").click(function () {
    if (!$(this).hasClass("selected")) {
        updateCell("text-align", "right", true);
    }
});


$(".icon-color-fill").hover(function () {
    $(".color-picker.fill").css("background-color", "lightgray");
},
    function () {
        $(".color-picker").css("background-color", "");

    });

$(".icon-color-text").hover(function () {
    $(".color-picker.text").css("background-color", "lightgray");
},
    function () {
        $(".color-picker").css("background-color", "");

    });

$(".color-fill-icon").click(function () {
    $(".fill").click();
});

$(".color-text-icon").click(function () {
    $(".text").click();
});

$(".fill").change(function () {
    updateCell("background-color", $(this).val());
});
$(".text").change(function () {
    updateCell("color", $(this).val());
});

$(".font-family-selector").change(function () {
    updateCell("font-family", $(this).val());
    $(".font-family-selector").css("font-family", $(this).val());
});
$(".font-size-selector").change(function () {
    updateCell("font-size", $(this).val());
});

function emptySheet() {
    let sheetInfo = cellData[selectedSheet];
    for (let i of Object.keys(sheetInfo)) {
        for (let j of Object.keys(sheetInfo[i])) {
            $(`#row-${i}-col-${j}`).text("");
            $(`#row-${i}-col-${j}`).css("background-color", "#ffffff");
            $(`#row-${i}-col-${j}`).css("color", "#000000");
            $(`#row-${i}-col-${j}`).css("text-align", "left");
            $(`#row-${i}-col-${j}`).css("font-weight", "");
            $(`#row-${i}-col-${j}`).css("font-style", "");
            $(`#row-${i}-col-${j}`).css("font-family", "Noto Sans");
            $(`#row-${i}-col-${j}`).css("text-decoration", "");
            $(`#row-${i}-col-${j}`).css("font-size", "14px");
        }
    }
}
function loadsheet() {
    let sheetInfo = cellData[selectedSheet];
    for (let i of Object.keys(sheetInfo)) {
        for (let j of Object.keys(sheetInfo[i])) {
            let cellInfo = cellData[selectedSheet][i][j];
            $(`#row-${i}-col-${j}`).text(cellInfo["text"]);
            $(`#row-${i}-col-${j}`).css("background-color", cellInfo["background-color"]);
            $(`#row-${i}-col-${j}`).css("color", cellInfo["color"]);
            $(`#row-${i}-col-${j}`).css("text-align", cellInfo["text-align"]);
            $(`#row-${i}-col-${j}`).css("font-weight", cellInfo["font-weight"]);
            $(`#row-${i}-col-${j}`).css("font-style", cellInfo["font-style"]);
            $(`#row-${i}-col-${j}`).css("font-family", cellInfo["font-family"]);
            $(`#row-${i}-col-${j}`).css("text-decoration", cellInfo["text-decoration"]);
            $(`#row-${i}-col-${j}`).css("font-size", cellInfo["font-size"]);
        }
    }
}

$(".icon-add").click(function () {
    emptySheet();
    let sheetName = "Sheet" + (lastSheet + 1);
    cellData[sheetName] = {};
    $(".sheet-tab.selected").removeClass("selected");
    $(".sheet-tab-container").append(`<div class="sheet-tab selected">${sheetName}</div>`);
    selectedSheet = sheetName;
    lastSheet++;
    totalSheets++;
    addSheetEvents();
});

function addSheetEvents() {
    $(".sheet-tab").click(function () {
        if (!$(this).hasClass("selected")) {
            selectSheet(this);
        }
    });
    $(".sheet-tab.selected").contextmenu(function (e) {
        e.preventDefault();
        if ($(".sheet-option-modal").length == 0) {
            $(".container").append(`<div class="sheet-option-modal">
                                        <div class="sheet-rename">Rename</div>
                                        <div class="sheet-delete">Delete</div>
                                    </div>`);
        };
        let x = this;
        $(".sheet-option-modal").css("left", e.pageX + "px");
        $(".sheet-rename").click(function () {
            $(".container").append(`<div class="sheet-rename-modal">
                                        <h4 style="font-size: 20px">Rename Sheet To:</h4>
                                        <input type="text" class="new-sheet-name" placeholder="Sheet Name">
                                        <div class="action-buttons">
                                        <div class="submit-button">Rename</div>
                                        <div class="cancel-button">Cancel</div>
                                        </div>
                                    </div>`);
            $(".cancel-button").click(function () {
                $(".sheet-rename-modal").remove();
            });
            $(".submit-button").click(function () {
                let newSheetName = $(".new-sheet-name").val();
                let Selectsheet = $(x).text();
                let newcellData = {};
                for (let i in cellData) {
                    if (i == Selectsheet) {
                        newcellData[newSheetName] = cellData[i];
                    }
                    else {
                        newcellData[i] = cellData[i];
                    }
                }
                cellData = newcellData;
                $(x).text(newSheetName);
                $(".sheet-rename-modal").remove();
                if ($(x).hasClass("selected")) {
                    selectedSheet = newSheetName;
                }
                console.log(cellData);
            });
        })
        $(".sheet-delete").click(function () {
            if (totalSheets > 1) {
                let Selectsheet = $(x).text();
                if ($(x).hasClass("selected")) {
                    let z = Object.keys(cellData);
                    let y = Object.keys(cellData).indexOf(Selectsheet);
                    if (y >=1 || (y <= totalSheets && y!=0)) {
                        $(".sheet-tab.selected").prev().click();
                        selectedSheet=Object.keys(cellData)[y-1];
                    }
                    else
                    {
                        $(".sheet-tab.selected").next().click();
                        selectedSheet=Object.keys(cellData)[y+1];
                    }
                }
                delete cellData[Selectsheet];
                $(x).remove();
                console.log(selectedSheet);
            }
            else {
                alert("Fuck You");
            }
        })
    });
}

$(".container").click(function () {
    $(".sheet-option-modal").remove();
})

addSheetEvents();

function selectSheet(ele) {
    $(".sheet-tab.selected").removeClass("selected");
    $(ele).addClass("selected");
    emptySheet();
    selectedSheet = $(ele).text();
    loadsheet();
}