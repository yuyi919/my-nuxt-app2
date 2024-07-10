import { QQBot } from "#imports";

interface IBotConfig_QQ {
  appid: string;
  secret: string;
  token: string;
  sandbox?: boolean;
  type?: "public" | "private";
}
function adapterQQ(config: IBotConfig_QQ): QQBot.Config {
  const type = config.type ?? "private";
  return {
    id: config.appid,
    secret: config.secret,
    token: config.token,
    type,
    sandbox: config.sandbox ?? false,
    intents:
      QQ.Intents.GUILDS |
      QQ.Intents.GUILD_MEMBERS |
      (type === "private"
        ? QQ.Intents.GUILD_MESSAGES
        : QQ.Intents.PUBLIC_GUILD_MESSAGES) |
      QQ.Intents.GUILD_MESSAGE_REACTIONS |
      QQ.Intents.DIRECT_MESSAGES,
    retryWhen: [],
  };
}

const config: IBotConfig_QQ = {
  appid: "102128160",
  token: "XFipyH3mHMVYv8I7HK4dYBwGnD7BF1Zy",
  secret: "GWm2Jar8PgxEWo6OgyGZsBUn6Pi2Mg1M",
};

export const $config = () => adapterQQ(config);

let access_token: string | undefined = undefined;
let expires_in: string | undefined = undefined;

const _getAppAccessToken = async (
  url: string = "https://bots.qq.com/app/getAppAccessToken"
) =>
  $fetch<{
    access_token: string;
    expires_in: string;
  }>(url, {
    headers: {
      "Content-Type": `application/json`,
    },
    method: "POST",
    body: {
      appId: config.appid,
      clientSecret: config.secret,
    },
  });
export const getAppAccessToken = async (url?: string) => {
  if (!access_token) {
    ({ access_token, expires_in } = await _getAppAccessToken(url));
  }
  return { access_token, expires_in };
};

export const $post = async <T extends {}>(url: string, body: T) => {
  if (!access_token) {
    ({ access_token, expires_in } = await _getAppAccessToken());
  }
  return $fetch<{}>(url, {
    headers: {
      Authorization: `QQBot ${access_token}`,
      // Authorization: `Bot ${config.id}.${config.token}`
      "X-Union-Appid": config.appid,
    },
    method: "POST",
    body,
    baseURL: "https://sandbox.api.sgroup.qq.com/",
  });
};

export const $get = async <T extends {}>(url: string, params: T = {} as T) => {
  if (!access_token) {
    ({ access_token, expires_in } = await getAppAccessToken());
  }
  return $fetch<{}>(url, {
    headers: {
      Authorization: `QQBot ${access_token}`,
      // Authorization: `Bot ${config.id}.${config.token}`
      "X-Union-Appid": config.appid,
    },
    method: "GET",
    baseURL: "https://sandbox.api.sgroup.qq.com/",
    params,
  });
};
