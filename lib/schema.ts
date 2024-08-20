import { zfd } from "zod-form-data";
import { z } from "zod";

export const schema = zfd.formData({
  username: z.string().min(1).max(40).nonempty(),
  surname:z.string().min(1).max(40).nonempty(),
  email:z.string().min(1).max(40).nonempty(),
  password:z.string().min(1).max(200).nonempty(),
});