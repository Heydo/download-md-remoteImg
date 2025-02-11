document.getElementById('selectFolder').addEventListener('click', async () => {
  const result = await window.electron.selectFolder();
  if (result) {
      const { folderPath, markdownData } = result;
      document.getElementById('folderPath').innerText = `Selected Folder: ${folderPath}`;

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
  const tableBody = document.getElementById('markdownTable').getElementsByTagName('tbody')[0];
  tableBody.innerHTML = ''; // 清空之前的条目

  data.forEach(data => {
      const row = tableBody.insertRow();
      const cell1 = row.insertCell(0);
      const cell2 = row.insertCell(1);
      cell1.textContent = data.fileName;
      cell2.textContent = data.imageCount;
  });
}
