import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";

export default function NewUpdateDialog() {
    const [open, setOpen] = useState(false)
    const [latestVersion, setLatestVersion] = useState("");

    useEffect(() => {
        async function checkForUpdate() {
            const currentVersion = chrome.runtime.getManifest().version;
            const res = await fetch("https://api.github.com/repos/hearts2hearts1/BetterFinder/releases/latest");
            const release = await res.json();

            if (release.tag_name && release.tag_name !== `v${currentVersion}`) {
                setLatestVersion(release.tag_name);
                setOpen(true);
            }
        }

        checkForUpdate();
    }, []);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="bg-zinc-900 border border-zinc-800 text-zinc-100">
                <DialogHeader>
                    <DialogTitle>Update Available</DialogTitle>
                    <DialogDescription className="text-zinc-400">
                        A new version <span className="text-zinc-200 font-mono">{latestVersion}</span> is available.
                    </DialogDescription>
                </DialogHeader>
                <div className="flex gap-2 justify-end mt-2">
                    <Button
                        variant="outline"
                        onClick={() => setOpen(false)}
                        className="border-zinc-700 text-zinc-400 hover:bg-zinc-800"
                    >
                        Dismiss
                    </Button>
                    <Button
                        onClick={() => window.open("https://github.com/hearts2hearts1/BetterFinder/releases/latest", "_blank")}
                    >
                        Download
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}