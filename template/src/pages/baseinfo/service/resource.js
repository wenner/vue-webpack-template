import Vue from 'vue'

//机构
export const orgResource = Vue.resource('location{/id}');
//用户
export const userResource = Vue.resource('user{/id}{/action}' , {} , {
  resetPassword: {method:"POST" , params:{action:"resetPassword"}}
});
//角色
export const roleResource = Vue.resource('role{/id}{/action}' , {} , {
  toggleStatus: {method:"POST" , params:{action:"toggleStatus"}} ,
  privilege: {params:{action:"privilege"}} ,
  savePrivilege: {method:"POST" , params:{action:"privilege"}}
});
//代码类别
export const codeCatalogResource = Vue.resource('code/catalog');
//代码值
export const codeResource = Vue.resource('code{/id}' , {} , {

});
//权限
export const privilegeResource = Vue.resource('privilege{/id}{/action}{/rangeId}' , {} , {
  allRanges: {params:{action:"range"}} ,
  range: {params:{action:"range"}} ,
  saveRange: {method:"POST" , params:{action:"range"}} ,
  deleteRange: {method:"DELETE" , params: {action:"range"}}
});
//权限范围
export const privilegeRangeResource = Vue.resource('privilegerange{/id}{/action}' , {} , {
});
/**
 * 将列表解析成树
 */
function parseTreeData(list, idKey, parentIdKey){
  idKey = idKey || "loc_id";
  parentIdKey = parentIdKey || "parentid";

  let nodes = [];
  let nodeMap = {};
  _.each(list, item=> {
    let id = item[idKey];
    nodeMap[id] = item;
  });
  _.each(list, (item, i)=> {
    let parentId = item[parentIdKey];
    if (parentId == "0") {
      nodes.push(item);
    } else {
      var parentNode = nodeMap[parentId];
      if (parentNode) {
        if (!parentNode.children) parentNode.children = [];
        parentNode.children.push(item);
      }else{
        //console.log("not found parent:"+parentId+" , id:"+item[idKey])
      }
    }
  });
  function sort(arr) {
    arr.sort((n1, n2)=> {
      return n1.loc_id - n2.loc_id;
    });
    _.each(arr, (item)=> {
      if (item.children) {
        sort(item.children);
      }
    });
  }
  sort(nodes);

  return nodes;
}
function parseComboData(tree){
  var nodes = [];

  var it = function(arr , path){
    var char = ' -> ';
    _.each(arr , (n)=>{
      var p = path ? path.split(char) : [];
      p.push(n.name);
      var newPath = p.join(char);
      n.pathText = newPath;
      nodes.push(n);
      if (n.children){
        it(n.children , n.pathText);
      }
    });
  };
  it(tree);
  return nodes;
}

export const treeLoader = {
  org: function(){
    return orgResource.query()
      .then(res=>{
        res.data.tree = parseTreeData(res.data.data, "loc_id", "parentid");
        res.data.comboData = parseComboData(res.data.tree);
        return res;
      });
  } ,
  privilege: function(){
    return privilegeResource.query()
      .then(res=>{
        res.data.tree = parseTreeData(res.data, "pri_id", "parentid");
        res.data.comboData = parseComboData(res.data.tree);
        return res;
      });
  }
};

export default {
  orgResource ,
  userResource ,
  roleResource ,
  codeResource ,
  privilegeResource ,
  privilegeRangeResource ,
  treeLoader
}
