import * as z from 'zod';

function validateData<T extends z.ZodType>(
    schema: T,
    data: unknown
): z.infer<T> {
    return schema.parse(data);
}

export default validateData;
