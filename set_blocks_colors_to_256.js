var ut = ThisDrawing.Utility

ut.Prompt("������ ������� ������ ������.")

// �������� ��������� ������ ������� �������
var blocks = ThisDrawing.Blocks
// ��������� ���������� ��� ����� ����������� �����
var block

ut.Prompt("����� ������ (������ � ����������): " + blocks.Count)

// �������� �� ���� ������ � ������ ���� ���� �������� �� �� ����
for (i = 0; i<blocks.Count; i++) {
  if (blocks.Item(i).Name.charAt(0) != "*") {
    block = blocks.Item(i)
    ut.Prompt(blocks.Item(i).Name)
    // � ������ ����� �������� �� ���� ��� ���������
    for (j=0; j<block.Count; j++){
      // ������ ���� ������� �������.
      // ���� 256 ��� ��� ��� �� ����.
      block.Item(j).Color = 256
    }
  }
}