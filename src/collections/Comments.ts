import { rbacHas } from "@/custom-fields/rbac/rbacHas";
import { ROLE_MODERATOR } from "@/custom-fields/rbac/roles";
import { checkHarmfulHook } from "@/helper/checkHarmfulHook";
import type { CollectionConfig } from "payload";

const Comments: CollectionConfig = {
  slug: "comments",
  access: {
    // Only filter harmful comments for non-logged in users
    read: ({ req }) => {
      if (req.user) {
        return true;
      }

      // For non-logged in users, filter out harmful comments
      return {
        isHarmful: {
          not_equals: true,
        },
      };
    },
    create: () => true,
    update: rbacHas(ROLE_MODERATOR),
    delete: rbacHas(ROLE_MODERATOR),
  },
  admin: {
    useAsTitle: "authorName",
    defaultColumns: ["authorName", "createdAt", "page", "isHarmful"],
    listSearchableFields: ["authorName", "authorEmail", "commentText"],
  },
  fields: [
    {
      name: "page",
      type: "relationship",
      relationTo: "pages",
      hasMany: false,
      required: true,
      admin: {
        description: "The page this comment is associated with",
      },
    },
    {
      name: "authorName",
      label: "Name",
      type: "text",
      required: true,
      admin: {
        description: "The name of the comment author",
      },
    },
    {
      name: "authorEmail",
      label: "Email",
      type: "email",
      required: true,
      admin: {
        description: "The email address of the comment author",
      },
    },
    {
      name: "commentText",
      label: "Comment",
      type: "textarea",
      required: true,
      admin: {
        description: "The comment text",
      },
    },
    {
      name: "isHarmful",
      label: "Flag as Harmful",
      type: "checkbox",
      defaultValue: false,
      admin: {
        description: "Check this box to flag harmful content that should not be published",
      },
    },
    {
      name: "harmfulReason",
      label: "Reason for Harmful Flag",
      type: "textarea",
      admin: {
        description: "Explain why this comment was flagged as harmful",
        condition: (data) => Boolean(data?.isHarmful),
      },
    },
  ],
  hooks: {
    beforeChange: [
      ({ operation, data }) => {
        // If creating a comment, set harmful to false by default
        if (operation === "create") {
          return {
            ...data,
            isHarmful: false,
            harmfulReason: "",
          };
        }
        return data;
      },
    ],
  },
};

export default Comments;
