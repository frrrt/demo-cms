import { mongooseAdapter } from "@payloadcms/db-mongodb";
import { s3Storage } from "@payloadcms/storage-s3";
import path from "path";
import { buildConfig } from "payload";
import { fileURLToPath } from "url";
import sharp from "sharp";

import { Users } from "./collections/Users";
import { Media } from "./collections/Media";
import { slateEditor } from "@payloadcms/richtext-slate";
import Pages from "./collections/Pages";
import UIStrings from "./collections/UIString";
import { DEFAULT_LOCALE, LOCALES } from "./const/locales";
import { UiStringMedia } from "./collections/UIStringMedia";
import { translateString } from "./custom-endpoints/translateString/translateString";
import Settings from "./collections/Settings";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  localization: {
    locales: LOCALES,
    defaultLocale: DEFAULT_LOCALE,
    fallback: true,
  },
  collections: [Users, Media, Pages, UIStrings, UiStringMedia],
  globals: [Settings],
  editor: slateEditor({}),
  secret: process.env.PAYLOAD_SECRET || "",
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
  db: mongooseAdapter({
    url: process.env.DATABASE_URI || "",
  }),
  sharp,
  plugins: [
    s3Storage({
      collections: {
        media: true,
        "ui-string-media": true,
      },
      bucket: process.env.S3_BUCKET ?? "",
      config: {
        credentials: {
          accessKeyId: process.env.S3_ACCESS_KEY_ID ?? "",
          secretAccessKey: process.env.S3_SECRET_ACCESS_KEY ?? "",
        },
        region: process.env.S3_REGION,
      },
    }),
  ],
  endpoints: [translateString],
  graphQL: {
    disable: true,
  },
});
