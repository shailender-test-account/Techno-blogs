'use client';
import api from '@/axios';
import { useState, useRef, useEffect, useCallback } from 'react';

const initialFormData = {
    plan_key: '',
    plan_name: '',
    tag_label: '',
    tag_color: '#4CAF50',
    title: '',
    price: '',
    price_display: '',
    period: 'month',
    original_price: '',
    popular: false,
    duration_days: '',
    currency: 'INR',
    features: '',
    is_active: true,
};

const initialTouched = {
    plan_key: false,
    plan_name: false,
    title: false,
    price: false,
    original_price: false,
    duration_days: false,
};

/**
 * Validate a single field and return its error message (or null).
 */
const validateField = (name, value) => {
    switch (name) {
        case 'plan_key': {
            const v = String(value).trim();
            if (!v) return 'Plan key is required';
            if (!/^[a-z0-9_]+$/.test(v))
                return 'Only lowercase letters, numbers, and underscores';
            if (v.length < 3) return 'Must be at least 3 characters';
            return null;
        }
        case 'plan_name': {
            const v = String(value).trim();
            if (!v) return 'Plan name is required';
            if (v.length > 100) return 'Max 100 characters';
            return null;
        }
        case 'title': {
            const v = String(value).trim();
            if (!v) return 'Title is required';
            if (v.length > 100) return 'Max 100 characters';
            return null;
        }
        case 'price': {
            if (value === '' || value === null || value === undefined)
                return 'Price is required';
            const n = parseFloat(value);
            if (isNaN(n)) return 'Price must be a number';
            if (n < 0) return 'Price cannot be negative';
            if (n > 9999999) return 'Price is too large';
            return null;
        }
        case 'original_price': {
            if (value === '' || value === null || value === undefined)
                return null; // optional
            const n = parseFloat(value);
            if (isNaN(n)) return 'Original price must be a number';
            if (n < 0) return 'Original price cannot be negative';
            return null;
        }
        case 'duration_days': {
            if (value === '' || value === null || value === undefined)
                return 'Duration is required';
            const n = parseInt(value, 10);
            if (isNaN(n)) return 'Duration must be a number';
            if (n <= 0) return 'Duration must be at least 1 day';
            if (n > 3650) return 'Duration cannot exceed 3650 days';
            return null;
        }
        default:
            return null;
    }
};

export default function SubForm({ onAddPlan, addToast }) {
    const [formData, setFormData] = useState(initialFormData);
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState(initialTouched);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const resetTimerRef = useRef(null);

    // Cleanup timer on unmount
    useEffect(() => {
        return () => {
            if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
        };
    }, []);

    const notify = useCallback(
        (msg, type = 'info') => {
            if (typeof addToast === 'function') {
                addToast(msg, type);
            } else {
                console.log(`[${type}] ${msg}`);
            }
        },
        [addToast]
    );

    // ---- Input change (live updates + clear error for that field) ----
    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        const finalValue = type === 'checkbox' ? checked : value;

        setFormData((prev) => {
            const updated = { ...prev, [name]: finalValue };

            // Auto-fill price_display when price or currency changes
            if (name === 'price' || name === 'currency') {
                const symbol =
                    updated.currency === 'USD'
                        ? '$'
                        : updated.currency === 'EUR'
                            ? '€'
                            : '₹';
                const priceValue =
                    updated.price !== '' ? parseFloat(updated.price) : NaN;
                updated.price_display = !isNaN(priceValue)
                    ? `${symbol}${priceValue}`
                    : '';
            }

            return updated;
        });

        // Live-revalidate the field if it has already been touched
        if (touched[name]) {
            const liveError = validateField(name, finalValue);
            setErrors((prev) => {
                if (liveError) return { ...prev, [name]: liveError };
                const next = { ...prev };
                delete next[name];
                return next;
            });
        } else if (errors[name]) {
            // User is fixing an existing error — clear it
            setErrors((prev) => {
                const next = { ...prev };
                delete next[name];
                return next;
            });
        }
    };

    // ---- Blur validation ----
    const handleBlur = (e) => {
        const { name, value } = e.target;
        setTouched((prev) => ({ ...prev, [name]: true }));

        const blurError = validateField(name, value);
        setErrors((prev) => {
            if (blurError) return { ...prev, [name]: blurError };
            const next = { ...prev };
            delete next[name];
            return next;
        });
    };

    // ---- Full-form validation (used on submit) ----
    const validateAll = () => {
        const newErrors = {};
        // All fields that we validate
        const fieldsToValidate = [
            'plan_key',
            'plan_name',
            'title',
            'price',
            'original_price',
            'duration_days',
        ];

        for (const field of fieldsToValidate) {
            const err = validateField(field, formData[field]);
            if (err) newErrors[field] = err;
        }

        setErrors(newErrors);
        setTouched((prev) => {
            const next = { ...prev };
            for (const f of fieldsToValidate) next[f] = true;
            return next;
        });

        return Object.keys(newErrors).length === 0;
    };

    const handleReset = () => {
        setFormData(initialFormData);
        setErrors({});
        setTouched(initialTouched);
        setIsSuccess(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (isSubmitting) return;

        if (!validateAll()) {
            notify('Please fix the highlighted fields', 'error');
            return;
        }

        setIsSubmitting(true);
        setIsSuccess(false);

        // Parse features: newline-separated → array
        const featuresArray = formData.features
            .split('\n')
            .map((f) => f.trim())
            .filter(Boolean);

        const payload = {
            plan_key: formData.plan_key.trim(),
            plan_name: formData.plan_name.trim(),
            tag_label: formData.tag_label.trim() || null,
            tag_color: formData.tag_color || null,
            title: formData.title.trim(),
            price: parseFloat(formData.price),
            price_display:
                formData.price_display?.trim() || `₹${formData.price}`,
            period: formData.period || null,
            original_price:
                formData.original_price !== ''
                    ? parseFloat(formData.original_price)
                    : null,
            popular: !!formData.popular,
            duration_days: parseInt(formData.duration_days, 10),
            currency: formData.currency,
            features: featuresArray,
            is_active: !!formData.is_active,
        };

        try {
            const response = await api.post('/api/plan/createplan', payload);
            const data = response?.data;

            // Success response shape: { success, message, data }
            if (data?.success) {
                setIsSuccess(true);
                notify(data.message || 'Plan created successfully!', 'success');

                if (typeof onAddPlan === 'function') {
                    onAddPlan(data.data ?? payload);
                }

                // Keep green success visible, then reset the form
                resetTimerRef.current = setTimeout(() => {
                    handleReset();
                }, 1500);
            } else {
                // Backend returned 200 but success=false
                notify(data?.message || 'Failed to create plan', 'error');
            }
        } catch (err) {
            console.error('createPlan error:', err);

            const backendMessage =
                err?.response?.data?.message ||
                err?.response?.data?.error ||
                err?.message ||
                'Failed to create plan';

            const status = err?.response?.status;

            // Map known backend errors to specific fields
            if (status === 409 || /already exists/i.test(backendMessage)) {
                setErrors((prev) => ({
                    ...prev,
                    plan_key:
                        'This plan key already exists. Please use a unique key.',
                }));
                setTouched((prev) => ({ ...prev, plan_key: true }));
            } else if (status === 400 && /plan_key/i.test(backendMessage)) {
                setErrors((prev) => ({ ...prev, plan_key: backendMessage }));
            } else if (status === 400 && /price/i.test(backendMessage)) {
                setErrors((prev) => ({ ...prev, price: backendMessage }));
            }

            notify(backendMessage, 'error');
        } finally {
            // Only clear the loading state — never touch isSuccess here
            setIsSubmitting(false);
        }
    };

    return (
        <div className="animate-fade-in-up">
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                    Add New Plan
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                    Create a new subscription plan for users.
                </p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 card-hover">
                <form
                    onSubmit={handleSubmit}
                    className="grid grid-cols-1 md:grid-cols-2 gap-6"
                    noValidate
                >
                    {/* Plan Key */}
                    <div>
                        <label
                            className={`form-label ${errors.plan_key ? 'label-error' : ''
                                }`}
                        >
                            Plan Key <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="plan_key"
                            value={formData.plan_key}
                            onChange={handleInputChange}
                            onBlur={handleBlur}
                            placeholder="e.g. pro_monthly"
                            className={`form-input ${errors.plan_key ? 'input-error' : ''
                                }`}
                            disabled={isSubmitting}
                        />
                        {errors.plan_key && (
                            <p className="error-message">
                                <i className="fa-solid fa-circle-exclamation"></i>{' '}
                                {errors.plan_key}
                            </p>
                        )}
                    </div>

                    {/* Plan Name */}
                    <div>
                        <label
                            className={`form-label ${errors.plan_name ? 'label-error' : ''
                                }`}
                        >
                            Plan Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="plan_name"
                            value={formData.plan_name}
                            onChange={handleInputChange}
                            onBlur={handleBlur}
                            placeholder="e.g. Pro"
                            className={`form-input ${errors.plan_name ? 'input-error' : ''
                                }`}
                            disabled={isSubmitting}
                        />
                        {errors.plan_name && (
                            <p className="error-message">
                                <i className="fa-solid fa-circle-exclamation"></i>{' '}
                                {errors.plan_name}
                            </p>
                        )}
                    </div>

                    {/* Title */}
                    <div className="md:col-span-2">
                        <label
                            className={`form-label ${errors.title ? 'label-error' : ''
                                }`}
                        >
                            Title <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleInputChange}
                            onBlur={handleBlur}
                            placeholder="e.g. Pro Plan — Best for growing teams"
                            className={`form-input ${errors.title ? 'input-error' : ''
                                }`}
                            disabled={isSubmitting}
                        />
                        {errors.title && (
                            <p className="error-message">
                                <i className="fa-solid fa-circle-exclamation"></i>{' '}
                                {errors.title}
                            </p>
                        )}
                    </div>

                    {/* Price */}
                    <div>
                        <label
                            className={`form-label ${errors.price ? 'label-error' : ''
                                }`}
                        >
                            Price <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <span className="absolute left-3 top-2.5 text-gray-400 text-sm">
                                {formData.currency === 'USD'
                                    ? '$'
                                    : formData.currency === 'EUR'
                                        ? '€'
                                        : '₹'}
                            </span>
                            <input
                                type="number"
                                step="0.01"
                                min="0"
                                name="price"
                                value={formData.price}
                                onChange={handleInputChange}
                                onBlur={handleBlur}
                                placeholder="299.00"
                                className={`form-input pl-7 ${errors.price ? 'input-error' : ''
                                    }`}
                                disabled={isSubmitting}
                            />
                        </div>
                        {errors.price && (
                            <p className="error-message">
                                <i className="fa-solid fa-circle-exclamation"></i>{' '}
                                {errors.price}
                            </p>
                        )}
                    </div>

                    {/* Original Price */}
                    <div>
                        <label
                            className={`form-label ${errors.original_price ? 'label-error' : ''
                                }`}
                        >
                            Original Price
                        </label>
                        <div className="relative">
                            <span className="absolute left-3 top-2.5 text-gray-400 text-sm">
                                {formData.currency === 'USD'
                                    ? '$'
                                    : formData.currency === 'EUR'
                                        ? '€'
                                        : '₹'}
                            </span>
                            <input
                                type="number"
                                step="0.01"
                                min="0"
                                name="original_price"
                                value={formData.original_price}
                                onChange={handleInputChange}
                                onBlur={handleBlur}
                                placeholder="499.00"
                                className={`form-input pl-7 ${errors.original_price ? 'input-error' : ''
                                    }`}
                                disabled={isSubmitting}
                            />
                        </div>
                        {errors.original_price && (
                            <p className="error-message">
                                <i className="fa-solid fa-circle-exclamation"></i>{' '}
                                {errors.original_price}
                            </p>
                        )}
                    </div>

                    {/* Price Display */}
                    <div>
                        <label className="form-label">Price Display</label>
                        <input
                            type="text"
                            name="price_display"
                            value={formData.price_display}
                            onChange={handleInputChange}
                            placeholder="e.g. ₹299"
                            className="form-input"
                            disabled={isSubmitting}
                        />
                        <p className="text-xs text-gray-400 mt-1">
                            Auto-filled from price &amp; currency — edit if
                            needed.
                        </p>
                    </div>

                    {/* Period */}
                    <div>
                        <label className="form-label">Period</label>
                        <select
                            name="period"
                            value={formData.period}
                            onChange={handleInputChange}
                            className="form-input appearance-none"
                            disabled={isSubmitting}
                        >
                            <option value="month">Month</option>
                            <option value="year">Year</option>
                            <option value="week">Week</option>
                            <option value="day">Day</option>
                            <option value="lifetime">Lifetime</option>
                        </select>
                    </div>

                    {/* Duration Days */}
                    <div>
                        <label
                            className={`form-label ${errors.duration_days ? 'label-error' : ''
                                }`}
                        >
                            Duration (Days){' '}
                            <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="number"
                            min="1"
                            name="duration_days"
                            value={formData.duration_days}
                            onChange={handleInputChange}
                            onBlur={handleBlur}
                            placeholder="e.g. 30"
                            className={`form-input ${errors.duration_days ? 'input-error' : ''
                                }`}
                            disabled={isSubmitting}
                        />
                        {errors.duration_days && (
                            <p className="error-message">
                                <i className="fa-solid fa-circle-exclamation"></i>{' '}
                                {errors.duration_days}
                            </p>
                        )}
                    </div>

                    {/* Currency */}
                    <div>
                        <label className="form-label">Currency</label>
                        <select
                            name="currency"
                            value={formData.currency}
                            onChange={handleInputChange}
                            className="form-input appearance-none"
                            disabled={isSubmitting}
                        >
                            <option value="INR">INR</option>
                            <option value="USD">USD</option>
                            <option value="EUR">EUR</option>
                        </select>
                    </div>

                    {/* Tag Label */}
                    <div>
                        <label className="form-label">Tag Label</label>
                        <input
                            type="text"
                            name="tag_label"
                            value={formData.tag_label}
                            onChange={handleInputChange}
                            placeholder="e.g. Popular"
                            className="form-input"
                            disabled={isSubmitting}
                        />
                    </div>

                    {/* Tag Color */}
                    <div>
                        <label className="form-label">Tag Color</label>
                        <div className="flex items-center gap-3">
                            <input
                                type="color"
                                name="tag_color"
                                value={formData.tag_color}
                                onChange={handleInputChange}
                                className="h-10 w-14 rounded cursor-pointer border border-gray-200"
                                disabled={isSubmitting}
                            />
                            <input
                                type="text"
                                name="tag_color"
                                value={formData.tag_color}
                                onChange={handleInputChange}
                                placeholder="#4CAF50"
                                className="form-input flex-1"
                                disabled={isSubmitting}
                            />
                        </div>
                    </div>

                    {/* Features */}
                    <div className="md:col-span-2">
                        <label className="form-label">
                            Features{' '}
                            <span className="text-gray-400">
                                (one per line)
                            </span>
                        </label>
                        <textarea
                            name="features"
                            value={formData.features}
                            onChange={handleInputChange}
                            placeholder={
                                'Unlimited access\nPriority support\nAd-free experience'
                            }
                            rows={4}
                            className="form-input resize-none"
                            disabled={isSubmitting}
                        />
                    </div>

                    {/* Toggles */}
                    <div className="flex items-center gap-6 md:col-span-2">
                        <label className="flex items-center gap-2 cursor-pointer select-none">
                            <input
                                type="checkbox"
                                name="popular"
                                checked={formData.popular}
                                onChange={handleInputChange}
                                className="w-4 h-4 rounded"
                                disabled={isSubmitting}
                            />
                            <span className="text-sm text-gray-700">
                                Mark as Popular
                            </span>
                        </label>

                        <label className="flex items-center gap-2 cursor-pointer select-none">
                            <input
                                type="checkbox"
                                name="is_active"
                                checked={formData.is_active}
                                onChange={handleInputChange}
                                className="w-4 h-4 rounded"
                                disabled={isSubmitting}
                            />
                            <span className="text-sm text-gray-700">
                                Active
                            </span>
                        </label>
                    </div>

                    {/* Actions */}
                    <div className="md:col-span-2 mt-4 flex gap-4">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`flex-1 text-white font-medium py-3 px-6 rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 ${isSuccess
                                    ? 'bg-green-600'
                                    : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700'
                                } ${isSubmitting
                                    ? 'opacity-70 cursor-not-allowed'
                                    : ''
                                }`}
                        >
                            {isSubmitting ? (
                                <>
                                    <i className="fa-solid fa-spinner fa-spin"></i>{' '}
                                    Processing...
                                </>
                            ) : isSuccess ? (
                                <>
                                    <i className="fa-solid fa-check"></i>{' '}
                                    Success!
                                </>
                            ) : (
                                <>
                                    <i className="fa-solid fa-save"></i> Save
                                    Plan
                                </>
                            )}
                        </button>
                        <button
                            type="button"
                            onClick={handleReset}
                            disabled={isSubmitting}
                            className="px-6 py-3 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Reset
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}