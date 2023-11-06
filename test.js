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
var axis_coord = []

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

ut.Prompt(blocks_coord[0])
