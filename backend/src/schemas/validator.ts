import * as z from 'zod';

const validateData = (
    schema: z.ZodObject<any, any>,
    data: Record<string, unknown>
) => {
    return schema.parse(data);
};

export default validateData;
