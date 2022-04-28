import asyncPlugin from 'preact-cli-plugin-async';

export default (config, env, helpers) => {
    const { plugin } = helpers.getPluginsByName(config, 'DefinePlugin')[0];
    plugin.definitions['process.env.PREACT_APP_HOST_URI'] = JSON.stringify(process.env.PREACT_APP_HOST_URI);
    plugin.definitions['process.env.PREACT_APP_VERSION'] = JSON.stringify(process.env.PREACT_APP_VERSION);
    asyncPlugin(config);
}


