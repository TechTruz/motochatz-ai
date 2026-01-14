import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function NavUser({
  user,
}: {
  user: {
    name: string;
    email: string;
    avatar: string;
    role: string;
  };
}) {
  return (
    <div className="flex items-center gap-2 cursor-pointer">
      <div className="text-right">
        <div className="text-sm font-medium">{user.name}</div>
        <div className="text-xs text-muted-foreground">{user.role}</div>
      </div>
      <Avatar className="h-8 w-8 rounded-lg bg-blue-600">
        <AvatarImage src={user.avatar} alt={user.name} />
        <AvatarFallback className="rounded-lg text-white font-semibold">
          {user.name
            .split(" ")
            .map((n) => n[0])
            .join("")}
        </AvatarFallback>
      </Avatar>
    </div>
  );
}
