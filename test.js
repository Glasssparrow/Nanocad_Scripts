var drawing = ThisDrawing
var ms = ThisDrawing.ModelSpace;
var ut  = ThisDrawing.Utility;
var db = ThisDrawing.Database
var model = ThisDrawing.ModelSpace
var layers = db.Layers

ut.Prompt("Начало работы скрипта")

var items_layer_name = "!Светильники"
var lines_layer_name = "!Метки размеров"

var items_layer
var lines_layer

var blocks_coord = []
var axis_segment = []

var check = 0

for (i=0; i < layers.Count; i++) {
  if (layers.Item(i).Name == items_layer_name) {
    item_layer = layers.Item(i)
    ut.Prompt(layers.Item(i).Name)
    check += 1
  }
  if (layers.Item(i).Name == lines_layer_name) {
    lines_layer = layers.Item(i)
    check += 1
  }
}

if (check < 2) {
  ut.Prompt("Не найден один из слоев");
}
else {
  ut.Prompt("Оба слоя ("+items_layer_name+" и "+lines_layer_name+") найдены")
}

for (i=0; i<model.Count; i++) {
  //ut.Prompt(i)
  //ut.Prompt(model.Item(i).ObjectName)
  if (model.Item(i).ObjectName == "AcDbPolyline" && 
      model.Item(i).Layer == "!Метки размеров") {
    //ut.Prompt(model.Item(i).ObjectName + " " + model.Item(i).Layer)
    var VVV = ut.CreateSafeArrayFromVector(model.Item(i).Coordinates)
    var CoordArray = VVV.toArray()
    //ut.Prompt(CoordArray.length)
    for (j=0; j<(CoordArray.length/2-1);j++) {
    //ut.Prompt(CoordArray)
    var line_segment = [
      [CoordArray[2*j], CoordArray[2*j+1]],
      [CoordArray[2*j+2], CoordArray[2*j+3]]
    ]
    //ut.Prompt(line_segment)
    axis_segment.push(line_segment)
    }
    //ut.Prompt(CoordArray)
  }
  if (model.Item(i).ObjectName == "AcDbBlockReference" && 
      model.Item(i).Layer == "!Светильники") {
    //ut.Prompt(model.Item(i).ObjectName)
    //ut.Prompt(model.Item(i).Layer)
    //ut.Prompt("start test")
    var AAA = model.Item(i).InsertionPoint
    var v1 = ut.CreateSafeArrayFromVector(AAA)
    var v2 = v1.toArray()
    blocks_coord.push(v2)
    //ut.Prompt(v2)
    //ut.Prompt("end test")
  }
}

ut.Prompt(axis_segment)
ut.Prompt(blocks_coord)
var start_x = 0
var start_y = 0
var end_x = 100
var end_y = 0
var height = 50

ut.Prompt("Начало теста\n")
var command = (
"Размер "+String(start_x)+","
+String(start_y)+" "+String(end_x)+","+String(end_y)+" "
)
command += String(end_x)
command += ","+String(end_y-height)+"\n"
ut.Prompt(command)
drawing.SendCommand(command)