/** 获取标签样式
 *  @param {text} text 对象键值
 *  @param {value} value 对象键值
 *  @param {index} index 遍历index
 */
exports.getAttrName = (value, text, index) => {
    console.log(value,text,index);
    let className = '';
    switch (value) {
        case 'id':
            className = 'ID';
            break;
        case 'sn':
            className = '序号';
            break;
        case 'status':
            className = '状态';
            break;
        case 'desc':
            className = '病害描述';
            break;
        case 'district':
            className = '区域';
            break;
        case 'road':
            className = '道路名称';
            break;
        case 'location':
            className = '位置描述';
            break;
        case 'lat':
            className = '经度坐标';
            break;
        case 'lng':
            className = '纬度坐标';
            break;
        case 'planedStartDate':
            className = '计划维修日期(开始)';
            break;
        case 'planedFinishDate':
            className = '计划维修日期(结束)';
            break;
        case 'createMemo':
            className = '创建备注';
            break;
        case 'createUser':
            className = '创建人';
            break;
        case 'createDate':
            className = '创建日期';
            break;
        case 'maintainDept':
            className = '维修单位';
            break;
        case 'applyMemo':
            className = '派单备注';
            break;
        case 'applyUser':
            className = '派单人';
            break;
        case 'actualStartDate':
            className = '实际维修日期(开始)';
            break;
        case 'actualFinishDate':
            className = '实际维修日期(结束)';
            break;
        case 'maintainQuantity':
            className = '维修数量';
            break;
        case 'maintainContent':
            className = '维修内容';
            break;
        case 'maintainMemo':
            className = '维修备注';
            break;
        case 'maintainUser':
            className = '维修人';
            break;
        case 'maintainDate':
            className = '维修日期';
            break;
        case 'acceptUser':
            className = '验收人';
            break;
        case 'acceptDate':
            className = '验收日期';
            break;
        case 'completeMemo':
            className = '归档备注';
            break;
        case 'completeUser':
            className = '归档人';
            break;
        case 'completeDate':
            className = '归档日期';
            break;
        default:
            className = '其他';
            break;
    }
    return className;
};
