import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { AuthService } from "../../services/auth.service";
import type { User } from "../../services/auth.service";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onSave: (user: User) => void;
}

export default function EditProfileModal({ isOpen, onClose, onSave }: Props) {
    const { token } = AuthService.getAuthData();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!isOpen) return;

        const u = AuthService.getAuthData().user;
        setName(u?.name || "");
        setEmail(u?.email || "");
    }, [isOpen]);

    if (!isOpen) return null;

    const handleClose = () => {
        setError(null);
        onClose();
    };

    const validateEmail = (value: string) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(value);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!name.trim()) {
            setError("Full name is required");
            return;
        }

        if (!validateEmail(email)) {
            setError("Please enter a valid email");
            return;
        }

        setSaving(true);

        try {
            // Call backend to update profile
            const updated = await AuthService.updateProfile(token, { name: name.trim(), email: email.trim() });

            // Persist locally with existing token
            AuthService.saveAuthData(token || "", updated);

            onSave(updated);
            handleClose();
        } catch (err) {
            setError((err as Error)?.message || "Error saving profile");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="customers-modal-backdrop" onClick={handleClose} aria-hidden="true">
            <div className="customers-modal customers-modal--styled" onClick={(ev) => ev.stopPropagation()}>
                <div className="customers-modal__header customers-modal__header--styled">
                    <h3>Edit Profile</h3>

                    <button type="button" className="customers-modal__close" onClick={handleClose}>
                        <X size={20} />
                    </button>
                </div>

                <form className="customers-modal__form customers-modal__form--grid" onSubmit={handleSubmit}>
                    {error && <div className="customers-feedback--error">{error}</div>}

                    <div className="customers-modal__field customers-modal__field--full">
                        <label htmlFor="profile_name">Full Name</label>
                        <input
                            id="profile_name"
                            name="profile_name"
                            type="text"
                            placeholder="Full Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>

                    <div className="customers-modal__field customers-modal__field--full">
                        <label htmlFor="profile_email">Email</label>
                        <input
                            id="profile_email"
                            name="profile_email"
                            type="email"
                            placeholder="name@company.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div className="customers-modal__footer">
                        <button type="button" className="customers-modal__cancel" onClick={handleClose}>
                            Cancel
                        </button>

                        <button type="submit" className="customers-modal__submit customers-modal__submit--styled" disabled={saving}>
                            {saving ? "Saving..." : "Save Changes"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
