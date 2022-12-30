import ExcelJS from 'exceljs'

export const autoWidthAction = (val,width=10)=> {
    if(val==null){
        width = 10
    }else if(val.toString().charCodeAt(0)>255){
        /*if chinese*/
        width = val.toString().length * 2;
    }else {
        width = val.toString().length;
    }

}

// 导出普通Excel
export const exportExcel = async ({column,data,filename,autoWidth,format})=>{
    console.log('data----------:',data)
    // 创建excel工作簿
    const workbook = new ExcelJS.Workbook()
    // 设置工作簿属性
    workbook.creator = 'Me'
    workbook.title = filename
    workbook.created = new Date()
    workbook.modified = new Date()
    // 添加工作表
    const worksheet = workbook.addWorksheet(filename)
    // 设置列名
    const columnsName = []
    console.log('column----------:',column)
    for (let item in column) {
        console.log('item----------:',item)
    }
    column.forEach((item,index)=>{
        const obj = {
            header: item.label,
            key: item.name,
            width:null
        }
        if(autoWidth){
            const maxArr = [autoWidthAction(item.label)]
            data.forEach(ite=> {
                const str = ite[item.name] || ''
                if(str){
                    maxArr.push(autoWidthAction(str))
                }
            })
            obj.width = Math.max(...maxArr)+5
        }
        // 设置列名、键和宽度
        columnsName.push(obj)
    })
   worksheet.columns = columnsName
    // 添加行
    worksheet.addRows(data)
    // 写入文件
    const uint8Array =
        format === "xlsx"
            ? await workbook.xlsx.writeBuffer()
            : await workbook.csv.writeBuffer()
    const blob = new Blob([uint8Array],{type: 'application/octet-binary'})
    // 判断是否允许用户在客户端上保存文件
    if(window.navigator.msSaveOrOpenBlob){
        // msSaveOrOpenBlob方法返回boolean值
        navigator.msSaveBlob(blob, filename + `.${format}`);
        // 本地保存
    }else {
        const link = document.createElement("a"); // a标签下载
        link.href = window.URL.createObjectURL(blob); // href属性指定下载链接
        link.download = filename + `.${format}`; // dowload属性指定文件名
        link.click(); // click()事件触发下载
        window.URL.revokeObjectURL(link.href); // 释放内存
    }
}
