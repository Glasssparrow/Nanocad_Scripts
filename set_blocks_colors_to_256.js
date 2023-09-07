var ut = ThisDrawing.Utility

ut.Prompt("Запуск очистки цветов блоков.")

// Получаем коллекцию блоков данного чертежа
var blocks = ThisDrawing.Blocks
// Объявляем переменную для блока понадобится позже
var block

ut.Prompt("Всего блоков (вместе с системными): " + blocks.Count)

// Проходим по всем блокам и меняем цвет всех объектов на по слою
for (i = 0; i<blocks.Count; i++) {
  if (blocks.Item(i).Name.charAt(0) != "*") {
    block = blocks.Item(i)
    ut.Prompt(blocks.Item(i).Name)
    // В каждом блоке проходим по всем его элементам
    for (j=0; j<block.Count; j++){
      // Меняем цвет каждого объекта.
      // Цвет 256 это как раз по слою.
      block.Item(j).Color = 256
    }
  }
}