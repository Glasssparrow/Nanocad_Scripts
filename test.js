var drawing = ThisDrawing
var ms = ThisDrawing.ModelSpace;
var ut  = ThisDrawing.Utility;
var db = ThisDrawing.Database
var model = ThisDrawing.ModelSpace
var layers = db.Layers

ut.Prompt("Начало работы скрипта")

// Слои с данными
var items_layer_name = "!Светильники"
var lines_layer_name = "!Метки размеров"
// Допустимая разница в высоте при которой светильники 
// могут иметь привязку друг к другу.
var height_difference_allowed = 1000
// Высота размеров
var height = 1000

// Переменные в которые мы записываем слои
var items_layer
var lines_layer

// Переменные для хранения списков координат
var blocks_coord = []
var axis_segment = []

// Количество найденных слоев
var check = 0

// Находим слои с соответствующими названиями
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

// Проверяем что слои найдены
if (check < 2) {
  ut.Prompt("Не найден один из слоев");
}
else {
  ut.Prompt("Оба слоя ("+items_layer_name+" и "+lines_layer_name+") найдены")
}

// Проходим по всем объектам и находим точки вставки блоков и 
// отрезки из которых состоят полилинии
for (i=0; i<model.Count; i++) {
  // Если это полилиния в нужном слое
  if (model.Item(i).ObjectName == "AcDbPolyline" && 
      model.Item(i).Layer == lines_layer_name) {
    // Преобразуем в лист
    var VVV = ut.CreateSafeArrayFromVector(model.Item(i).Coordinates)
    var CoordArray = VVV.toArray()
    // Формируем список отрезков из списка координат вершин
    for (j=0; j<(CoordArray.length/2-1);j++) {
      var line_segment = [
        [CoordArray[2*j], CoordArray[2*j+1]],
        [CoordArray[2*j+2], CoordArray[2*j+3]]
      ]
    // Добавляем в лист
    axis_segment.push(line_segment)
    }
  }
  // Если это блок в нужном слое
  if (model.Item(i).ObjectName == "AcDbBlockReference" && 
      model.Item(i).Layer == "!Светильники") {
    // Получаем точку вставки и преобразуем её в лист
    var AAA = model.Item(i).InsertionPoint
    var v1 = ut.CreateSafeArrayFromVector(AAA)
    var v2 = v1.toArray()
    // Добавляем в лист
    blocks_coord.push(v2)
  }
}

// Функция построения размера
function draw_dim(start_x, start_y, end_x, end_y, height) {
var command = (
"Размер "+String(start_x)+","
+String(start_y)+" "+String(end_x)+","+String(end_y)+" "
)
command += String(end_x)
command += ","+String(end_y-height)+"\n"
drawing.SendCommand(command)
}

// Переменные для построения размеров
var start_x
var start_y
var end_x
var end_y


// Есть ли размеры
var left_dim_exist
var right_dim_exist
// Лист потенциальных точек для размеров
var points_list = []
var top_of_segment
var bottom_of_segment
// Координаты для points_list
var x_coord
var y_coord
//Проходим по всем блокам и чертим размеры
for (i=0; i<blocks_coord.length; i++) {
  // Проходим по всем фрагментам осей.
  // Формируем список потенциальных точек для размеров.
  for (j=0; j<axis_segment.length; j++) {
      // Горизонтальные линии игнорируем
      if (axis_segment[j][0][1] == axis_segment[j][1][1]) {
        continue;
      }
      // Находим верх и низ отрезка
      else { if (axis_segment[j][0][1] > axis_segment[j][1][1]) {
        top_of_segment = axis_segment[j][0]
        bottom_of_segment = axis_segment[j][1]
      }
      else {
        top_of_segment = axis_segment[j][1];
        bottom_of_segment = axis_segment[j][0];
      }}
      // Если низ отрезка ниже точки вставки блока и 
      // верх выше тогда добавляем в список потенциальных точек.
      if (
        bottom_of_segment[1] < blocks_coord[i][1] && 
        top_of_segment[1] > blocks_coord[i][1]
      ) {
        y_coord = blocks_coord[i][1]
        x_coord = (bottom_of_segment[0] +
        (top_of_segment[0] - bottom_of_segment[0]) /
          (top_of_segment[1] - bottom_of_segment[1])
        )
        points_list.push([x_coord, y_coord])
      }
    }
  // Проходим по блокам и находим те что на схожей высоте
  // Добавляем их в список точек
  for (j=0; j<blocks_coord.length; j++) {
      if (i == j) {continue}
      x_coord = blocks_coord[j][0]
      y_coord = blocks_coord[j][1]
      if (
        (blocks_coord[i][1] - y_coord) < height_difference_allowed ||
        (y_coord - blocks_coord[i][1]) < height_difference_allowed
      ) {
        points_list.push([x_coord, y_coord])
      }
    }
  left_dim_exist = false
  right_dim_exist = false
  // Проходим по списку потенциальных точек и находим точки для размеров
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
      //ut.Prompt("Левый размер")
      //ut.Prompt("Размер")
      //ut.Prompt(points_list[j][0])
      //ut.Prompt("Блок")
      //ut.Prompt(blocks_coord[i][0])
    }
    else { if (
      right_dim_exist &&
      (points_list[j][0]-blocks_coord[i][0]) < 0 &&
      true
    ) {
      }
    }
    if (
      !right_dim_exist &&
      (points_list[j][0]-blocks_coord[i][0]) > 0
    ) {
      //ut.Prompt("Правый размер")
      //ut.Prompt("Размер")
      //ut.Prompt(points_list[j][0])
      //ut.Prompt("Блок")
      //ut.Prompt(blocks_coord[i][0])
    }
    else { if (
      right_dim_exist &&
      (points_list[j][0]-blocks_coord[i][0]) > 0 &&
      true
    ) {
      }
    }
    //ut.Prompt(points_list[j])
  }
  if (left_dim_exist) {draw_dim(start_x, start_y, end_x, end_y, height)}
  points_list = []
}

ut.Prompt("end test")
