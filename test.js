var ms = ThisDrawing.ModelSpace;
var ut  = ThisDrawing.Utility;
var db = ThisDrawing.Database
var model = ThisDrawing.ModelSpace
var layers = db.Layers

ut.Prompt("������ ������ �������")

var items_layer_name = "!�����������"
var lines_layer_name = "!����� ��������"

var items_layer
var lines_layer

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
  ut.Prompt("�� ������ ���� �� �����");
}
else {
  ut.Prompt("��� ���� ("+items_layer_name+" � "+lines_layer_name+") �������")
}

for (i=0; i<model.Count; i++) {
  //ut.Prompt(i)
  //ut.Prompt(model.Item(i).ObjectName)
  if (model.Item(i).ObjectName == "AcDbPolyline" && 
      model.Item(i).Layer == "!����� ��������") {
    ut.Prompt(model.Item(i).ObjectName)
    ut.Prompt(model.Item(i).Layer)
  }
  if (model.Item(i).ObjectName == "AcDbBlockReference" && 
      model.Item(i).Layer == "!�����������") {
    ut.Prompt(model.Item(i).ObjectName)
    ut.Prompt(model.Item(i).Layer)
  }
}
 