var drawing = ThisDrawing
var ms = ThisDrawing.ModelSpace;
var ut  = ThisDrawing.Utility;
var db = ThisDrawing.Database
var model = ThisDrawing.ModelSpace
var layers = db.Layers

ut.Prompt("������ ������ �������")

// ���� � �������
var items_layer_name = "!�����������"
var lines_layer_name = "!����� ��������"
// ���������� ������� � ������ ��� ������� ����������� 
// ����� ����� �������� ���� � �����.
var height_difference_allowed = 500
// ������ ��������
var height = 500

// ���������� � ������� �� ���������� ����
var items_layer
var lines_layer

// ���������� ��� �������� ������� ���������
var blocks_coord = []
var axis_segment = []

// ���������� ��������� �����
var check = 0

// ������� ���� � ���������������� ����������
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

// ��������� ��� ���� �������
if (check < 2) {
  ut.Prompt("�� ������ ���� �� �����");
}
else {
  ut.Prompt("��� ���� ("+items_layer_name+" � "+lines_layer_name+") �������")
}

// �������� �� ���� �������� � ������� ����� ������� ������ � 
// ������� �� ������� ������� ���������
for (i=0; i<model.Count; i++) {
  // ���� ��� ��������� � ������ ����
  if (model.Item(i).ObjectName == "AcDbPolyline" && 
      model.Item(i).Layer == lines_layer_name) {
    // ����������� � ����
    var VVV = ut.CreateSafeArrayFromVector(model.Item(i).Coordinates)
    var CoordArray = VVV.toArray()
    // ��������� ������ �������� �� ������ ��������� ������
    for (j=0; j<(CoordArray.length/2-1);j++) {
      var line_segment = [
        [CoordArray[2*j], CoordArray[2*j+1]],
        [CoordArray[2*j+2], CoordArray[2*j+3]]
      ]
    // ��������� � ����
    axis_segment.push(line_segment)
    }
  }
  // ���� ��� ���� � ������ ����
  if (model.Item(i).ObjectName == "AcDbBlockReference" && 
      model.Item(i).Layer == "!�����������") {
    // �������� ����� ������� � ����������� � � ����
    var AAA = model.Item(i).InsertionPoint
    var v1 = ut.CreateSafeArrayFromVector(AAA)
    var v2 = v1.toArray()
    // ��������� � ����
    blocks_coord.push(v2)
  }
}

// ������� ���������� �������
function draw_dim(start_x, start_y, end_x, end_y, height) {
var command = (
"������ "+String(start_x)+","
+String(start_y)+" "+String(end_x)+","+String(end_y)+" "
)
command += String(end_x)
command += ","+String(end_y-height)+"\n"
drawing.SendCommand(command)
}

// ������� ������ � ��������� ������
// ��� ����� ��� ���������� ������ �������� �� ������ ������
var blocks_x_coord = []
for (i=0; i<blocks_coord.length; i++) {
  blocks_x_coord.push(blocks_coord[i][0])
}

// ���������� ��� ���������� ����� ��������
var start_x
var start_y
var end_x
var end_y

// ���������� ��� ���������� ������ ��������
var start_x_r
var start_y_r
var end_x_r
var end_y_r


// ���� �� �������
var left_dim_exist
var right_dim_exist
var right_dim_copy
// ���� ������������� ����� ��� ��������
var points_list = []
var top_of_segment
var bottom_of_segment
// ���������� ��� points_list
var x_coord
var y_coord
//�������� �� ���� ������ � ������ �������
for (i=0; i<blocks_coord.length; i++) {
  // �������� �� ���� ���������� ����.
  // ��������� ������ ������������� ����� ��� ��������.
  for (j=0; j<axis_segment.length; j++) {
      // �������������� ����� ����������
      if (axis_segment[j][0][1] == axis_segment[j][1][1]) {
        continue;
      }
      // ������� ���� � ��� �������
      else { if (axis_segment[j][0][1] > axis_segment[j][1][1]) {
        top_of_segment = axis_segment[j][0]
        bottom_of_segment = axis_segment[j][1]
      }
      else {
        top_of_segment = axis_segment[j][1];
        bottom_of_segment = axis_segment[j][0];
      }}
      // ���� ��� ������� ���� ����� ������� ����� � 
      // ���� ���� ����� ��������� � ������ ������������� �����.
      if (
        bottom_of_segment[1] < blocks_coord[i][1] && 
        top_of_segment[1] > blocks_coord[i][1]
      ) {
        y_coord = blocks_coord[i][1]
        x_coord = (bottom_of_segment[0] + 
        (blocks_coord[i][1] - bottom_of_segment[1]) *
        (top_of_segment[0] - bottom_of_segment[0]) / 
        (top_of_segment[1] - bottom_of_segment[1])  
        )
        points_list.push([x_coord, y_coord])
      }
    }
  // �������� �� ������ � ������� �� ��� �� ������ ������
  // ��������� �� � ������ �����
  for (j=0; j<blocks_coord.length; j++) {
      if (i == j) {continue}
      x_coord = blocks_coord[j][0]
      y_coord = blocks_coord[i][1]
      if (
        Math.abs(blocks_coord[j][1] - y_coord) < height_difference_allowed
      ) {
        points_list.push([x_coord, y_coord])
      }
    }
  left_dim_exist = false
  right_dim_exist = false
  // �������� �� ������ ������������� ����� � ������� ����� ��� ��������
  for (j=0; j<points_list.length; j++) {
    if (
      points_list[j][0] == blocks_coord[i][0]
    ) {continue}
    if (
      !left_dim_exist &&
      (points_list[j][0]-blocks_coord[i][0]) < 0
    ) {
      left_dim_exist = true
      end_x = blocks_coord[i][0]
      end_y = blocks_coord[i][1]
      start_x = points_list[j][0]
      start_y = points_list[j][1]
    }
    else { if (
      left_dim_exist &&
      (points_list[j][0]-blocks_coord[i][0]) < 0 &&
      Math.abs(end_x - start_x) > 
      Math.abs(end_x - points_list[j][0])
    ) {
      start_x = points_list[j][0]
      start_y = points_list[j][1]
      }
    }
    if (
      !right_dim_exist &&
      (points_list[j][0]-blocks_coord[i][0]) > 0
    ) {
      right_dim_exist = true
      end_x_r = blocks_coord[i][0]
      end_y_r = blocks_coord[i][1]
      start_x_r = points_list[j][0]
      start_y_r = points_list[j][1]
    }
    else { if (
      right_dim_exist &&
      (points_list[j][0]-blocks_coord[i][0]) > 0 &&
      Math.abs(end_x - start_x) > 
      Math.abs(end_x - points_list[j][0])
    ) {
      start_x_r = points_list[j][0]
      start_y_r = points_list[j][1]
      }
    }
  }
  if (left_dim_exist) {
    draw_dim(start_x, start_y, end_x, end_y, height)
  }
  right_dim_copy = false
  for (k=0; k<blocks_x_coord.length; k++) {
   if (blocks_x_coord[k] == start_x_r) {
    right_dim_copy = true
   }
  }
  if (right_dim_exist && !right_dim_copy) {
    draw_dim(start_x_r, start_y_r, end_x_r, end_y_r, height)
  }
  points_list = []
}

ut.Prompt("���������� �������� ���������.")
