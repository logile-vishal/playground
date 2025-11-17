import { useDirtyFormGuard } from "@/core/hooks/useDirtyFormGuard";
import { type ReactElement } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";

type FormValues = {
    firstName: string;
    lastName: string;
};

export default function TestPage(): ReactElement {
const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isDirty },
} = useForm<FormValues>({
    defaultValues: {
        firstName: "",
        lastName: "",
    },
});

useDirtyFormGuard(isDirty);

const onSubmit: SubmitHandler<FormValues> = async (data) => {
    await new Promise((r) => setTimeout(r, 700));
    console.log("Submitted data:", data);
    alert("Submitted! Check console for form data.");
    reset({}, { keepDirty: false, keepDirtyValues: true });
};

return (
    <div style={{ padding: 20, fontFamily: "system-ui, sans-serif", maxWidth: 800 }}>
        <h2>React Hook Form — Test Page</h2>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <div style={{ marginBottom: 12 }}>
                <label>
                    First name
                    <input
                        {...register("firstName", { required: "First name is required", minLength: { value: 2, message: "Too short" } })}
                        style={{ marginLeft: 8, padding: 6 }}
                    />
                </label>
                <div style={{ color: "red", fontSize: 12 }}>{errors.firstName?.message}</div>
            </div>

            <div style={{ marginBottom: 12 }}>
                <label>
                    Last name
                    <input
                        {...register("lastName", { required: "Last name required" })}
                        style={{ marginLeft: 8, padding: 6 }}
                    />
                </label>
                <div style={{ color: "red", fontSize: 12 }}>{errors.lastName?.message}</div>
            </div>

            <div style={{ marginTop: 18, display: "flex", gap: 8 }}>
                <button type="submit" disabled={isSubmitting} style={{ padding: "8px 12px" }}>
                    {isSubmitting ? "Submitting..." : "Submit"}
                </button>
                <button type="button" onClick={() => reset()} style={{ padding: "8px 12px" }}>
                    Reset
                </button>
            </div>
        </form>

        <section style={{ marginTop: 24, background: "#f8f8f8", padding: 12, borderRadius: 6 }}>
            <h4 style={{ marginTop: 0 }}>isDirty: {isDirty ? "true" : "false"}</h4>
        </section>
    </div>
);
}