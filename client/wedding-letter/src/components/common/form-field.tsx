import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Control, FieldValues, UseControllerProps } from 'react-hook-form'

interface FormProps<TFieldValues extends FieldValues> extends UseControllerProps<TFieldValues> {
  control: Control<TFieldValues>
  type?: string
  label?: string
  placeholder?: string
  description?: string
}

export default function CommonFormField<TFieldValues extends FieldValues>({
  control,
  type,
  label,
  placeholder = '',
  name,
  description,
}: FormProps<TFieldValues>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className='flex'>
          <FormLabel className='w-28'>{label}</FormLabel>
          <FormControl>
            <Input type={type} placeholder={placeholder} {...field} />
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
