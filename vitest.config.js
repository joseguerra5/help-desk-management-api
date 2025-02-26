"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("vitest/config");
exports.default = (0, config_1.defineConfig)(async () => {
    const tsconfigPaths = (await Promise.resolve().then(() => require('vite-tsconfig-paths'))).default;
    return {
        test: {
            globals: true,
            root: './',
        },
        plugins: [tsconfigPaths()],
    };
});
//# sourceMappingURL=vitest.config.js.map