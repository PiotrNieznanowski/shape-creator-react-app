export const defaultOptions = {
    fill: "rgba(0, 0, 0, 1)",
    stroke: "rgba(255, 255, 255, 0)",
    strokeUniform: true,
    resource: {},
    link: {
      enabled: false,
      type: "resource",
      state: "new",
      dashboard: {},
    },
    tooltip: {
      enabled: true,
      type: "resource",
      template: "<div>{{message.name}}</div>",
    },
    animation: {
      type: "none",
      loop: true,
      autoplay: true,
      duration: 1000,
    },
    userProperty: {},
    trigger: {
      enabled: false,
      type: "alarm",
      script: "return message.value > 0;",
      effect: "style",
    },
  };

