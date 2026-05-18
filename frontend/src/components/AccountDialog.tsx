import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
  DialogDescription,
} from "@/components/ui/dialog";
import { X } from "lucide-react";
import { useAuthStore } from "@/stores/auth.store";

interface AccountDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AccountDialog({ open, onOpenChange }: AccountDialogProps) {
  const { user } = useAuthStore();

  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-2xl mx-auto px-4 sm:px-0 border-gray-700 bg-[#0F1729]">
        <DialogHeader className="flex items-center justify-between pr-8">
          <DialogTitle className="text-lg text-white">Akun Saya</DialogTitle>
          <DialogClose className="absolute top-4 right-4 rounded-sm opacity-70 ring-offset-[#0F1729] transition-opacity hover:opacity-100">
            <X className="h-4 w-4 text-gray-400 hover:text-white" />
            <span className="sr-only">Close</span>
          </DialogClose>
        </DialogHeader>
        <DialogDescription className="sr-only">
          Display your account information
        </DialogDescription>

        <div className="space-y-4">
          {/* User Info */}
          <div className="rounded-lg border border-gray-800 bg-[#090b11] p-4">
            <div className="space-y-3">
              <div>
                <p className="text-xs text-gray-400">Nama</p>
                <p className="text-sm font-medium text-white">
                  {user.firstName}
                  {user.lastName ? ` ${user.lastName}` : ""}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-400">Email</p>
                <p className="text-sm break-all text-gray-300">{user.email}</p>
              </div>

              <div>
                <p className="text-xs text-gray-400">User ID</p>
                <p className="font-mono text-xs break-all text-gray-400">
                  {user.userId}
                </p>
              </div>
            </div>
          </div>

          {/* Garage Info */}
          <div className="rounded-lg border border-gray-800 bg-[#090b11] p-4">
            <p className="mb-3 text-xs font-semibold text-gray-400">BENGKEL</p>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-gray-400">Nama Bengkel</p>
                <p className="text-sm font-medium text-white">
                  {user.garageName}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-400">Garage ID</p>
                <p className="font-mono text-xs break-all text-gray-400">
                  {user.garageId}
                </p>
              </div>
            </div>
          </div>

          {/* Role */}
          <div className="rounded-lg border border-gray-800 bg-[#090b11] p-4">
            <div>
              <p className="text-xs text-gray-400">Role</p>
              <div className="mt-2 flex items-center gap-2">
                <span
                  className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    user.role === "ADMIN"
                      ? "bg-purple-900/30 text-purple-300"
                      : "bg-blue-900/30 text-blue-300"
                  }`}
                >
                  {user.role}
                </span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
