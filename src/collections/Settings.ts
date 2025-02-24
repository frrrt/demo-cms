import { rbacHas } from "@/custom-fields/rbac/rbacHas";
import { isUser, ROLE_ADMIN } from "@/custom-fields/rbac/roles";
import { GlobalConfig } from "payload";

const Settings: GlobalConfig = {
  slug: "settings",
  access: {
    // This is an internal collection, so we restrict access to users.
    read: isUser,
    update: rbacHas(ROLE_ADMIN),
  },
  fields: [
    {
      name: "chatgptModel",
      label: "ChatGPT model used for translations",
      type: "text",
      admin: {
        components: {
          Field: "@/custom-fields/select-chatgpt-models/SelectField",
        },
      },
    },
    {
      name: "askChatgptPrompt",
      label: "Ask ChatGPT Prompt ",
      type: "textarea",
      admin: {
        description: "Available placeholder: {locale}, {context}, {term}",
      },
    },
  ],
};

export default Settings;
