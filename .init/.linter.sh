#!/bin/bash
cd /home/kavia/workspace/code-generation/signal-strength-analyzer-209157-209166/frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

