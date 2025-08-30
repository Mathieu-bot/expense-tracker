import { Button, TextField } from "../../ui";
import Dialog from "../../ui/Dialog";
import { useMemo } from "react";
import type { UsernameModalProps } from "../../types/Auth";

const USERNAME_REGEX = /^[A-Za-z0-9_-]{3,50}$/;

export default function UsernameModal({
  open,
  email,
  username,
  onUsernameChange,
  onClose,
  onSkip,
  onSave,
  saving = false,
}: UsernameModalProps) {
  const usernameError = useMemo(() => {
    const v = username.trim();
    if (!v) return "Username is required";
    if (!USERNAME_REGEX.test(v)) return "3–50 chars, letters, numbers, _ or -";
    return null;
  }, [username]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="Complete your profile"
      footer={
        <>
          <Button type="button" onClick={onSkip} className="text-gray-700 hover:bg-gray-100" disabled={saving}>Skip</Button>
          <Button type="button" onClick={onSave} disabled={!!usernameError || saving} loading={saving}>
            Save
          </Button>
        </>
      }
    >
      <div className="space-y-3">
        <p className="text-sm text-gray-600">You’re signed up. Choose a username to personalize your account.</p>
        <TextField
          label="Email"
          type="email"
          value={email}
          onChange={() => {}}
          disabled
          variant="standard"
          autoComplete="off"
        />
        <TextField
          label="Username"
          type="text"
          value={username}
          onChange={(e) => onUsernameChange(e.target.value.slice(0, 50))}
          placeholder="Choose your username"
          variant="standard"
          error={!!usernameError}
          helperText={usernameError || undefined}
          classes={{ label: ``, input: ``, error: 'hidden' }}
          autoComplete="off"
        />
      </div>
    </Dialog>
  );
}
