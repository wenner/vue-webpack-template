export const RESOLVED = false;
export const DISTRICTS = [
  {id: 1, name: "和平区"},
  {id: 2, name: "南开区"},
  {id: 3, name: "河西区"},
  {id: 4, name: "河东区"},
  {id: 5, name: "河北区"},
  {id: 6, name: "红桥区"}
];
export const ROAD_LEVELS = [
  {id: 0, name: "无等级"},
  {id: 1, name: "支路"},
  {id: 2, name: "次干线"},
  {id: 3, name: "主干线"},
  {id: 4, name: "快速路"}
];
export const ROAD_OWNERSHIP_TYPES = [
  {id: 1, name: "市属产权"},
  {id: 1, name: "区属产权"},
  {id: 1, name: "社会产权"},
  {id: 1, name: "无主产权"}
];
export const OWNERSHIPS = [
  {id: 1, name: "道桥处", shortName: "道桥处"},
  {id: 1, name: "和平区市政局", shortName: "和平"},
  {id: 1, name: "南开区市政局", shortName: "南开区"},
  {id: 1, name: "河西区市政局", shortName: "河西区"},
  {id: 1, name: "河东区市政局", shortName: "河东区"},
  {id: 1, name: "河北区市政局", shortName: "河北区"},
  {id: 1, name: "红桥区市政局", shortName: "红桥区"},
];
var domain = "http://60.29.110.104:6080/arcgis/rest/services";
const MAP_URL = {
  GeometryServer: domain + "/Utilities/Geometry/GeometryServer",
  TimeSenseLayer: domain + "/天津市/天津时间点/MapServer",
  roadShpEdit_FeatureServer: domain + "/天津市/天津市路网编辑/FeatureServer",
  roadShpEdit_MapServer: domain + "/天津市/天津市路网编辑/MapServer",
  roadShp_MapServer: domain + "/天津市/天津市路网矢量图/MapServer"
};

export default {
  RESOLVED,
  DISTRICTS,
  OWNERSHIPS,
  ROAD_LEVELS,
  ROAD_OWNERSHIP_TYPES,
  MAP_URL
};
