import React from 'react';
import { I18nManager } from 'react-native';
import Svg, { Path, Defs, LinearGradient, Stop } from 'react-native-svg';
const RTL_TRANSFORM = {
  transform: [{
    rotateY: '180deg'
  }]
};
const StarBorder = _ref => {
  let {
    size,
    color
  } = _ref;
  return /*#__PURE__*/React.createElement(Svg, {
    height: size,
    viewBox: "0 0 24 24",
    width: size
  }, /*#__PURE__*/React.createElement(Path, {
    fill: color,
    d: "M22 9.24l-7.19-.62L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.63-7.03L22 9.24zM12 15.4l-3.76 2.27 1-4.28-3.32-2.88 4.38-.38L12 6.1l1.71 4.04 4.38.38-3.32 2.88 1 4.28L12 15.4z"
  }));
};
const StarFull = _ref2 => {
  let {
    size,
    color,
    index
  } = _ref2;
  const gradientId = `full-gradient-${index}`;
  return /*#__PURE__*/React.createElement(Svg, {
    height: size,
    viewBox: "0 0 24 24",
    width: size
  }, /*#__PURE__*/React.createElement(Defs, null, /*#__PURE__*/React.createElement(LinearGradient, {
    id: gradientId,
    x1: "0",
    y1: "0",
    x2: "1",
    y2: "0"
  }, /*#__PURE__*/React.createElement(Stop, {
    offset: "100%",
    stopColor: color,
    stopOpacity: "1"
  }), /*#__PURE__*/React.createElement(Stop, {
    offset: "100%",
    stopColor: color,
    stopOpacity: "0"
  }))), /*#__PURE__*/React.createElement(Path, {
    d: "M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z",
    fill: `url(#${gradientId})`,
    stroke: color,
    strokeWidth: "1.5"
  }));
};
const StarQuarter = _ref3 => {
  let {
    size,
    color,
    index
  } = _ref3;
  const gradientId = `quarter-gradient-${index}`;
  return /*#__PURE__*/React.createElement(Svg, {
    height: size,
    viewBox: "0 0 24 24",
    width: size
  }, /*#__PURE__*/React.createElement(Defs, null, /*#__PURE__*/React.createElement(LinearGradient, {
    id: gradientId,
    x1: "0",
    y1: "0",
    x2: "1",
    y2: "0"
  }, /*#__PURE__*/React.createElement(Stop, {
    offset: "33%",
    stopColor: color,
    stopOpacity: "1"
  }), /*#__PURE__*/React.createElement(Stop, {
    offset: "33%",
    stopColor: color,
    stopOpacity: "0"
  }))), /*#__PURE__*/React.createElement(Path, {
    d: "M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z",
    fill: `url(#${gradientId})`,
    stroke: color,
    strokeWidth: "1.5"
  }));
};
const StarThreeQuarter = _ref4 => {
  let {
    size,
    color,
    index
  } = _ref4;
  const gradientId = `three-quarter-gradient-${index}`;
  return /*#__PURE__*/React.createElement(Svg, {
    height: size,
    viewBox: "0 0 24 24",
    width: size
  }, /*#__PURE__*/React.createElement(Defs, null, /*#__PURE__*/React.createElement(LinearGradient, {
    id: gradientId,
    x1: "0",
    y1: "0",
    x2: "1",
    y2: "0"
  }, /*#__PURE__*/React.createElement(Stop, {
    offset: "66%",
    stopColor: color,
    stopOpacity: "1"
  }), /*#__PURE__*/React.createElement(Stop, {
    offset: "66%",
    stopColor: color,
    stopOpacity: "0"
  }))), /*#__PURE__*/React.createElement(Path, {
    d: "M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z",
    fill: `url(#${gradientId})`,
    stroke: color,
    strokeWidth: "1.5"
  }));
};
const StarHalf = _ref5 => {
  let {
    size,
    color,
    index
  } = _ref5;
  const gradientId = `half-gradient-${index}`;
  return /*#__PURE__*/React.createElement(Svg, {
    height: size,
    viewBox: "0 0 24 24",
    width: size,
    style: I18nManager.isRTL ? RTL_TRANSFORM : undefined
  }, /*#__PURE__*/React.createElement(Defs, null, /*#__PURE__*/React.createElement(LinearGradient, {
    id: gradientId,
    x1: "0",
    y1: "0",
    x2: "1",
    y2: "0"
  }, /*#__PURE__*/React.createElement(Stop, {
    offset: "50%",
    stopColor: color,
    stopOpacity: "1"
  }), /*#__PURE__*/React.createElement(Stop, {
    offset: "50%",
    stopColor: color,
    stopOpacity: "0"
  }))), /*#__PURE__*/React.createElement(Path, {
    d: "M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z",
    fill: `url(#${gradientId})`,
    stroke: color,
    strokeWidth: "1.5"
  }));
};
const getStarComponent = type => {
  switch (type) {
    case 'full':
      return StarFull;
    case 'half':
      return StarHalf;
    case 'quarter':
      return StarQuarter;
    case 'three-quarter':
      return StarThreeQuarter;
    default:
      return StarBorder;
  }
};
const StarIcon = _ref6 => {
  let {
    index,
    type,
    size,
    color
  } = _ref6;
  const Component = getStarComponent(type);
  return /*#__PURE__*/React.createElement(Component, {
    index: index,
    size: size,
    color: color
  });
};
export default StarIcon;
//# sourceMappingURL=StarIcon.js.map