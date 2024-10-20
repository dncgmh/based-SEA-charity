# Based SEA Charity

A blockchain-based charitable donation platform built for the Based SEA Buildathon.

## Project Overview

Based SEA Charity is an innovative solution that leverages Base's blockchain technology to create a transparent and efficient charitable donation system. Our platform aims to address the challenges of transparency, trust, and efficiency in charitable giving, particularly in Southeast Asian countries like Vietnam that face annual natural disasters and ongoing poverty issues.

### Key Features

- **Blockchain-based Transparency**: All transactions are recorded on the blockchain, providing complete visibility into fund flow.
- **Smart Contract Efficiency**: Streamlined fund distribution with minimized administrative overhead.
- **User-friendly Interface**: Integrated with Base's smart wallet technology for ease of use.
- **Identity and Recognition**: Incorporation of Base names for enhanced user recognition.

## Live Demo

Check out our live demo at [based-sea-charity.vercel.app](https://based-sea-charity.vercel.app/)

## Technology Stack

- Solidity
- Next.js
- MongoDB
- Node.js
- React.js

## Smart Contract Transactions

- [Transaction 1](https://sepolia.basescan.org/tx/0xf806d80989357c438baa9590c148b1bff4bf5829994a88e5e74e2ffd7563a9ad)
- [Transaction 2](https://sepolia.basescan.org/tx/0x6e0ae9c3b7d047a2d91ef34f212f008b48f18c56481aa22a7d94499a1b01ddf6)

## Project Motivation

This project was inspired by the need for increased transparency in charitable donations, especially during natural disasters in Southeast Asia. By utilizing blockchain technology, we aim to restore public trust in charitable campaigns and ensure efficient distribution of funds to those in need.

## Challenges Addressed

- Lack of transparency in financial donations
- Trust issues in charitable campaigns
- Difficulties in verifying donation amounts
- Inefficient fund distribution

## Future Vision

We envision this platform as a catalyst for increased awareness and understanding of blockchain technology in Vietnam and beyond. Our goal is to showcase how blockchain can be applied to solve real-world problems, particularly in the realm of charitable giving.

## Getting Started

Follow these steps to set up the project locally:

1. Clone the repository:

   ```
   git clone https://github.com/dncgmh/based-SEA-charity.git
   cd based-SEA-charity
   ```

2. Install dependencies using Bun:

   ```
   bun install
   ```

3. Set up environment variables:

   ```
   cp .env.example .env
   ```

   Then, edit the `.env` file with your specific configuration.

4. Start the development servers:
   ```
   bun dev:server
   ```
   In a separate terminal:
   ```
   bun dev:web
   ```

The server and web application should now be running locally.
