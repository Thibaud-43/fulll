module.exports = {
  default: {
    requireModule: ["ts-node/register"],
    require: ["Domain/**/__features__/*.steps.ts"],
    paths: ["Domain/**/__features__/*.feature"],
  },
};
