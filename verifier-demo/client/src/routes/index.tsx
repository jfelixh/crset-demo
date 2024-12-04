import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";

import imgUrl from "@/assets/smile.jpg";

import { AuthContext } from "@/context/authContext";
import { useContext } from "react";

function Index() {
  console.log("AuthContext: ", useContext(AuthContext)?.appState);
  return (
    <section className="bg-secondary !mt-0">
      <div className="grid grid-cols-[1fr_10fr_1fr] w-full min-h-[55vh] py-4">
        <div className="col-start-2 grid grid-cols-2 h-full gap-8">
          <motion.div
            className="flex justify-center items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-left space-y-4">
              <h1 className="text-5xl font-bold">
                The bank you'll <br /> love to bank with.
              </h1>
              <h2 className="text-xl font-light">
                Apply for a loan with the power of web3. We don't care about
                your credit score.
              </h2>
              <Button size="lg">Apply for a loan now!</Button>
            </div>
          </motion.div>

          <motion.div
            className="flex justify-center items-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="p-8 rounded-xl">
              <img
                // src="https://media.istockphoto.com/id/1358205700/photo/shot-of-a-young-man-using-his-smartphone-to-send-text-messages.jpg?s=612x612&w=0&k=20&c=TV26GSLYVo3p2QyjKRCe6KdfQbIlZs638IGrViakNbk%3D"
                src={imgUrl}
                alt="Image"
                className="rounded-md object-cover"
              />
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export const Route = createFileRoute("/")({
  component: Index,
});
