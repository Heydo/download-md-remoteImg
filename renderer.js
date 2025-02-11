document.getElementById("selectFolder").addEventListener("click", async () => {
  const result = await window.electron.selectFolder();
  if (result) {
    const { folderPath, markdownData } = result;
    document.getElementById(
      "folderPath"
    ).innerText = `Selected Folder: ${folderPath}`;

    // 对 markdownData 进行排序（按文件名中的数字部分排序）
    const sortedMarkdownData = markdownData.sort((a, b) => {
      const numA = extractNumber(a.fileName);
      const numB = extractNumber(b.fileName);

      return numA - numB;
    });

    // 更新表格
    updateTable(sortedMarkdownData);
  }
});

// 提取文件名中的数字部分
function extractNumber(fileName) {
  const match = fileName.match(/^(\d+)/); // 匹配文件名开头的数字
  return match ? parseInt(match[1], 10) : 0;
}

// 更新表格
function updateTable(data) {
  const tableBody = document.getElementById("markdownTable").getElementsByTagName("tbody")[0];
  tableBody.innerHTML = ""; // 清空之前的条目

  data.forEach((data, index) => {
    const row = tableBody.insertRow();
    const cell0 = row.insertCell(0);
    const cell1 = row.insertCell(1);
    const cell2 = row.insertCell(2);
    const cell3 = row.insertCell(3); // 操作列
    const cell4 = row.insertCell(4); // 已下载图片数量
    const cell5 = row.insertCell(5); // 下载失败图片数量

    cell0.textContent = index + 1; // 设置序号
    cell1.textContent = data.fileName; // 文件名
    cell2.textContent = data.imageCount; // 图片数量
    cell4.textContent = '-'; // 已下载图片数量初始化为“-”
    cell5.textContent = '-'; // 下载失败图片数量初始化为“-”

    // 创建按钮
    const button = document.createElement('button');
    button.textContent = '查看文件名';

    // 为按钮添加点击事件
    button.addEventListener('click', () => {
      console.log(`文件名: ${data.fileName}`);
    });

    // 将按钮添加到操作单元格中
    cell3.appendChild(button);
  });
}
