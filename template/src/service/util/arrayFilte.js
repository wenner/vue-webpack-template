// import * as _ from 'lodash'
/**
 * 多条件过滤类
 *@pamar {class} new一个class
 *@return {Array} 返回过滤后的array
 */

export class Filter {
    constructor(data) {
        this.data = data;
        this.filters = {};
    }

//设置过滤条件
    set(key, filter) {
        this.filters[key] = filter;
    }

//将过滤条件封装成函数数组
    getFilters() {
        return Object.keys(this.filters).map(key=>this.filters[key]);
    }

//对传入的值进行过滤,返回过滤后的值
    /*    filter() {
     let data = this.data;
     for (let f of this.getFilters()) {
     data = data.filter(f)
     }
     return data;
     }*/
    /*//改进一:
     //此处 利用lodash的延迟处理,导入lodash库
     filter() {
     let chain = _.chain(this.data);
     for (let f of this.getFilters()) {
     chain = chain.filter(f);
     }
     return chain.value();
     }*/
    /*    // 改进二:
     //自己实现延迟处理
     filter() {
     let data = this.data;
     const filters = this.getFilters();
     return data.filter(m=> {
     for (let f of filters) {
     //如果某个filter已经把它过滤掉了,也不用再用后面的filter来判断了
     if (!f(m)) {
     return false;
     }
     }
     return true;
     });
     }*/
    //改进二 里面的 for 循环还可以用 Array.prototype.every 来简化：
    filter() {
        let data = this.data;
        const filters = this.getFilters();
        return data.filter(m=> {
            return filters.every(f=>f(m))
        })
    }
}

/*
* 用于设置对象值到本地对象
* */
/*function setLocalObjValue(key,value) {
    if (_.isString(key)) {
        this[key] = value;
    } else {
        _.each(key, (item, ikey)=> {
            if (_.isPlainObject(item)) {
                _.merge(this[ikey], item);
            } else {
                this[ikey] = item;
            }
        });
    }
}*/
//用法
//setLocalObjValue("obj","{a:1,b:2}");

