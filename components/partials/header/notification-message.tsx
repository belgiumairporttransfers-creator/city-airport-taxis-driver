"use client";

import { Bell } from "@/components/svg";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";

const NotificationMessage = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative h-9 w-9 rounded-full text-default-500 hover:bg-default-100 hover:text-primary data-[state=open]:bg-default-100 dark:text-default-800 dark:hover:bg-default-200 dark:data-[state=open]:bg-default-200 md:h-10 md:w-10"
        >
          <Bell className="h-6 w-6 md:h-[1.65rem] md:w-[1.65rem]" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="z-999 mx-4 w-[min(100vw-2rem,412px)] p-0 lg:w-[412px]"
      >
        <DropdownMenuLabel className="flex h-full w-full items-center bg-primary p-4">
          <span className="flex-1 text-base font-semibold text-primary-foreground">
            Notifications
          </span>
        </DropdownMenuLabel>
        <div className="max-h-[360px]">
          <ScrollArea className="h-full max-h-[360px]">
            <div className="px-4 py-6 text-center text-sm text-default-500">
              No notifications yet
            </div>
          </ScrollArea>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationMessage;
