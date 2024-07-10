import { QQBot } from "#imports";

interface IBotConfig_QQ {
  appid: string;
  secret: string;
  token: string;
  sandbox?: boolean;
  type: "public" | "private";
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
  secret: "GWm2Jar8PgxEWo6OgyGZsBUn6Pi2Mg1M",
  token: "XFipyH3mHMVYv8I7HK4dYBwGnD7BF1Zy",
  type: "private",
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
  // $fetch<{}>(url, {
  //   headers: {
  //     // "Content-Type":
  //     //   body instanceof FormData ? "multipart/form-data" : `application/json`,
  //     // Authorization: `QQBot ${access_token}`,
  //     "User-Agent": `BotNodeSDK/v${"2.9.4"}`,
  //     Authorization: `Bot ${config.appid}.${config.token}`,
  //     // "X-Union-Appid": config.appid,
  //   },
  //   method: "POST",
  //   body: body,
  //   baseURL: "https://sandbox.api.sgroup.qq.com",
  // });
  return fetch(`https://sandbox.api.sgroup.qq.com${url}`, {
    headers: {
      "Content-Type": `application/json`,
      Authorization: `QQBot ${access_token}`,
      "User-Agent": `BotNodeSDK/v${"2.9.4"}`,
      // Authorization: `Bot ${config.appid}.${config.token}`,
      "X-Union-Appid": config.appid,
    },
    method: "POST",
    body: JSON.stringify(body),
  })
    .then((res) => res.json())
    .catch((e) => {
      console.error(e);
      return e;
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
