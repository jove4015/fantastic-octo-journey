import { NextApiRequest, NextApiResponse } from "next";

export default function buildId(
  _req: NextApiRequest,
  res: NextApiResponse
): void {
  res.status(200).json({
    buildId: process.env.BUILD_ID,
  });
}
