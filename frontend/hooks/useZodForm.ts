import { useForm, type UseFormProps, type UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { ZodType, ZodTypeDef } from "zod";

export type UseZodFormReturn<TSchema extends ZodType<any, ZodTypeDef, any>> = UseFormReturn<
  TSchema["_output"]
>;

export function useZodForm<TSchema extends ZodType<any, ZodTypeDef, any>>(
  schema: TSchema,
  options?: UseFormProps<TSchema["_output"]>,
): UseZodFormReturn<TSchema> {
  return useForm<TSchema["_output"]>({
    resolver: zodResolver(schema),
    mode: "onBlur",
    ...options,
  });
}


