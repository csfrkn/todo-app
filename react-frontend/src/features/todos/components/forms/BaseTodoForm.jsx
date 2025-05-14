import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useTheme } from '../../../../contexts/ThemeContext';
import { getThemeColors } from '../../../../theme/colors';
import { commonStyles } from '../../../../theme/styles';
import categoryService from '../../../../api/categoryService';
import { motion, AnimatePresence } from 'framer-motion';

const schema = yup.object().shape({
    title: yup
        .string()
        .required('Başlık zorunludur')
        .max(100, 'Başlık en fazla 100 karakter olabilir'),
    description: yup
        .string()
        .max(500, 'Açıklama en fazla 500 karakter olabilir'),
    status: yup
        .string()
        .oneOf(['pending', 'in_progress', 'completed'], 'Geçersiz durum')
        .required('Durum zorunludur'),
    priority: yup
        .string()
        .oneOf(['low', 'medium', 'high'], 'Geçersiz öncelik')
        .required('Öncelik zorunludur'),
    due_date: yup
        .mixed()
        .nullable()
        .test('is-date', 'Geçerli bir tarih giriniz', value => {
            if (!value) return true;
            const date = new Date(value);
            return date instanceof Date && !isNaN(date);
        })
        .test('is-future', 'Geçmiş bir tarih seçemezsiniz', value => {
            if (!value) return true;
            const date = new Date(value);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            return date >= today;
        }),
    categories: yup
        .array()
        .of(yup.number())
        .nullable()
});

const BaseTodoForm = ({ 
    onSubmit, 
    initialData = null, 
    isSubmitting = false,
    showSuccessMessage = false,
    isAdding = true 
}) => {
    const { isDark } = useTheme();
    const colors = getThemeColors(isDark);
    const [categories, setCategories] = React.useState([]);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        setValue
    } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            title: '',
            description: '',
            status: 'pending',
            priority: 'medium',
            due_date: '',
            categories: []
        }
    });

    useEffect(() => {
        loadCategories();
        if (initialData) {
            Object.keys(initialData).forEach(key => {
                if (key === 'due_date' && initialData[key]) {
                    const date = new Date(initialData[key]);
                    const formattedDate = date.toISOString().split('T')[0];
                    setValue(key, formattedDate);
                } else if (key === 'categories' && initialData[key]) {
                    setValue(key, initialData[key].map(c => c.id));
                } else {
                    setValue(key, initialData[key]);
                }
            });
        }
    }, [initialData, setValue]);

    const loadCategories = async () => {
        try {
            const response = await categoryService.getAllCategories();
            setCategories(response.data);
        } catch (error) {
            console.error('Kategoriler yüklenirken hata:', error);
        }
    };

    const onSubmitForm = async (data) => {
        try {
            const formData = {
                ...data,
                due_date: data.due_date ? new Date(data.due_date).toISOString() : null
            };
            await onSubmit(formData);
            if (!initialData) reset();
        } catch (error) {
            console.error('Form gönderilirken hata:', error);
        }
    };

    const labelClasses = `block text-sm font-medium ${colors.text.secondary}`;
    const errorClasses = 'mt-1.5 text-sm text-red-500 flex items-center gap-1.5';

    return (
        <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-6">
            {/* Başlık */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
            >
                <label htmlFor="title" className={labelClasses}>
                    <div className="flex items-center gap-2 mb-1.5">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                        </svg>
                        Başlık
                    </div>
                </label>
                <input
                    type="text"
                    id="title"
                    {...register('title')}
                    className={`${commonStyles.input.base(isDark)} ${errors.title ? 'border-red-500 focus:ring-red-500/20' : ''}`}
                    placeholder="Görev başlığını girin..."
                />
                <AnimatePresence>
                    {errors.title && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className={errorClasses}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                            </svg>
                            {errors.title.message}
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>

            {/* Açıklama */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
            >
                <label htmlFor="description" className={labelClasses}>
                    <div className="flex items-center gap-2 mb-1.5">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12" />
                        </svg>
                        Açıklama
                    </div>
                </label>
                <textarea
                    id="description"
                    {...register('description')}
                    className={`${commonStyles.input.base(isDark)} min-h-[100px] resize-y`}
                    placeholder="Görev açıklamasını girin..."
                />
                <AnimatePresence>
                    {errors.description && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className={errorClasses}
                        >
                            {errors.description.message}
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>

            {/* Durum ve Öncelik */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="grid grid-cols-2 gap-4"
            >
                <div>
                    <label htmlFor="status" className={labelClasses}>
                        <div className="flex items-center gap-2 mb-1.5">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z" />
                            </svg>
                            Durum
                        </div>
                    </label>
                    <select
                        id="status"
                        {...register('status')}
                        className={`${commonStyles.input.base(isDark)} appearance-none cursor-pointer`}
                    >
                        <option value="pending">⏳ Bekliyor</option>
                        <option value="in_progress">🔄 Devam Ediyor</option>
                        <option value="completed">✅ Tamamlandı</option>
                    </select>
                    <AnimatePresence>
                        {errors.status && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className={errorClasses}
                            >
                                {errors.status.message}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <div>
                    <label htmlFor="priority" className={labelClasses}>
                        <div className="flex items-center gap-2 mb-1.5">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                            </svg>
                            Öncelik
                        </div>
                    </label>
                    <select
                        id="priority"
                        {...register('priority')}
                        className={`${commonStyles.input.base(isDark)} appearance-none cursor-pointer`}
                    >
                        <option value="low">🟢 Düşük</option>
                        <option value="medium">🟡 Orta</option>
                        <option value="high">🔴 Yüksek</option>
                    </select>
                    <AnimatePresence>
                        {errors.priority && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className={errorClasses}
                            >
                                {errors.priority.message}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>

            {/* Bitiş Tarihi */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
            >
                <label htmlFor="due_date" className={labelClasses}>
                    <div className="flex items-center gap-2 mb-1.5">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                        </svg>
                        Bitiş Tarihi
                    </div>
                </label>
                <input
                    type="date"
                    id="due_date"
                    {...register('due_date')}
                    className={`${commonStyles.input.base(isDark)} ${errors.due_date ? 'border-red-500 focus:ring-red-500/20' : ''}`}
                />
                <AnimatePresence>
                    {errors.due_date && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className={errorClasses}
                        >
                            {errors.due_date.message}
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>

            {/* Kategoriler */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
            >
                <label className={labelClasses}>
                    <div className="flex items-center gap-2 mb-1.5">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
                        </svg>
                        Kategoriler
                    </div>
                </label>
                <select
                    multiple
                    {...register('categories')}
                    className={`${commonStyles.input.base(isDark)} min-h-[100px]`}
                >
                    {categories.map(category => (
                        <option key={category.id} value={category.id}>
                            {category.name}
                        </option>
                    ))}
                </select>
                <AnimatePresence>
                    {errors.categories && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className={errorClasses}
                        >
                            {errors.categories.message}
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>

            {/* Submit Button */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="flex justify-end"
            >
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={isSubmitting || showSuccessMessage}
                    type="submit"
                    className={`
                        relative overflow-hidden
                        px-6 py-2.5 rounded-xl
                        text-white font-medium
                        transition-all duration-200
                        disabled:opacity-70 disabled:cursor-not-allowed
                        bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500
                        hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600
                        focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
                        shadow-lg shadow-indigo-500/25
                        flex items-center gap-2
                    `}
                >
                    {isSubmitting ? (
                        <>
                            <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Kaydediliyor...
                        </>
                    ) : (
                        <>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            {isAdding ? 'Görevi Ekle' : 'Görevi Güncelle'}
                        </>
                    )}
                </motion.button>
            </motion.div>
        </form>
    );
};

export default BaseTodoForm; 