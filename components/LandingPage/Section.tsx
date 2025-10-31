"use client"

import { styled } from "@mui/material"
import type { PropsWithChildren } from "react"

const StyledSection = styled("section")(({ theme }) => ({
  // minHeight: "100vh",
}))

// Props with children allow us to pass children ele in Section
export default function Section({children} : PropsWithChildren) {
  return (
    <StyledSection>{children}</StyledSection>
  )
}