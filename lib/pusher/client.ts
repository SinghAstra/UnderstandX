import Pusher from "pusher-js";

console.log("In PusherClient");
console.log(
  "process.env.NEXT_PUBLIC_PUSHER_KEY is ",
  process.env.NEXT_PUBLIC_PUSHER_APP_KEY
);
console.log(
  "process.env.NEXT_PUBLIC_PUSHER_CLUSTER is ",
  process.env.NEXT_PUBLIC_PUSHER_CLUSTER
);

const pusherClient = new Pusher(process.env.NEXT_PUBLIC_PUSHER_APP_KEY!, {
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
});

export default pusherClient;
