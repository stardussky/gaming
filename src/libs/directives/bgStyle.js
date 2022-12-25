const setBackground = (el, binding) => {
  const { contain, lazy, transparent } = binding.modifiers;
  const size = contain ? "contain" : "cover";
  const { value } = binding;
  const color = transparent ? "" : "#cbcbcb";
  if (value) {
    if (!lazy) {
      el.setAttribute("data-background", "");
      el.style.background = `${color} url('${value}') no-repeat center / ${size}`;
      return;
    }
  }
  el.style.backgroundPosition = "center";
  el.style.backgroundSize = size;
  el.style.backgroundColor = color;
};

export default {
  created: setBackground,
  updated: setBackground,
};
