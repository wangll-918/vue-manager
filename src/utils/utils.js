// 可放置公共函数，方便多次调用


// 封装补0函数
export let getnum = (num) => {
    return num < 10 ? "0" + num : num;
}

// 转换UTC时间格式  转换时间格式
export let getTime = (timevalue) => {
    // 三目
    let date = (typeof timevalue == 'string' ? new Date(timevalue) : timevalue);
    /*     let date
        // 传入时间格式是否为字符串/对象
        if (typeof timevalue == 'string') {
            date = new Date(timevalue)
        } else
            date = timevalue; // 获取时间  中国时区*/
    return date.getFullYear() + "-" + getnum(date.getMonth() + 1) + "-" + getnum(date.getDate()) + " " + getnum(date.getHours()) + ":" + getnum(date.getMinutes()) + ":" + getnum(date.getSeconds())
}

// 暴露出去
// export default { getnum, getTime }