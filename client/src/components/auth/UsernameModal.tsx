import { Button, TextField } from "../../ui";
import Dialog from "../../ui/Dialog";
import { useMemo } from "react";
import type { UsernameModalProps } from "../../types/Auth";
import { modalInputCls, submitCls, textFieldModalCls } from "./constants";

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
    if (!v) return null;
    if (!USERNAME_REGEX.test(v)) return "3–50 chars, letters, numbers, _ or -";
    return null;
  }, [username]);
  const usernameHelper = useMemo(() => {
    const v = username.trim();
    if (!v) return "Optional";
    return usernameError ?? undefined;
  }, [username, usernameError]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="Complete your profile"
      footer={
        <>
          <Button type="button" onClick={onSkip} className="text-gray-200 bg-gray-200/10 hover:bg-gray-200/20" disabled={saving}>Skip</Button>
          <Button type="button" onClick={onSave} disabled={!!usernameError || saving} loading={saving} loadingPosition="start" className={`${submitCls} !bg-accent !text-primary-dark`}>
            Save
          </Button>
        </>
      }
      classes={{panel: "!bg-primary/80 !backdrop-blur-sm", title: "!text-light", header:"!text-primary-dark", overlay:"!bg-black/10",body: "text-light" }}
    >
      <div className="space-y-3">
        <p className="text-sm text-light">You’re signed up. Choose a username to personalize your account.</p>
        <TextField
          label="Email"
          type="email"
          value={email}
          onChange={() => {}}
          disabled
          variant="standard"
          autoComplete="off"
          classes={{ label: `!text-accent`, input: `${modalInputCls} text-white`}}
        />
        <TextField
          label="Username"
          type="text"
          value={username}
          onChange={(e) => onUsernameChange(e.target.value.slice(0, 50))}
          variant="standard"
          error={!!usernameError}
          helperText={usernameHelper}
          classes={textFieldModalCls}
          autoComplete="off"
        />
      </div>
    </Dialog>
  );
}
