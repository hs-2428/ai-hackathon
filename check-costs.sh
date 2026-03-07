#!/bin/bash

# Cost Monitoring Script
# Check current AWS costs for the project

echo "💰 Checking AWS Costs..."
echo ""

# Get today's date and yesterday's date
TODAY=$(date -u +%Y-%m-%d)
YESTERDAY=$(date -u -d '1 day ago' +%Y-%m-%d 2>/dev/null || date -u -v-1d +%Y-%m-%d)
WEEK_AGO=$(date -u -d '7 days ago' +%Y-%m-%d 2>/dev/null || date -u -v-7d +%Y-%m-%d)

# Today's costs
echo "📅 Today's Costs ($TODAY):"
aws ce get-cost-and-usage \
    --time-period Start=$YESTERDAY,End=$TODAY \
    --granularity DAILY \
    --metrics BlendedCost \
    --query 'ResultsByTime[0].Total.BlendedCost.Amount' \
    --output text 2>/dev/null | xargs printf "\$%.4f\n" || echo "Data not available yet"
echo ""

# Last 7 days
echo "📅 Last 7 Days Costs:"
aws ce get-cost-and-usage \
    --time-period Start=$WEEK_AGO,End=$TODAY \
    --granularity DAILY \
    --metrics BlendedCost \
    --query 'ResultsByTime[].{Date:TimePeriod.Start,Cost:Total.BlendedCost.Amount}' \
    --output table 2>/dev/null || echo "Data not available yet"
echo ""

# Service breakdown
echo "📊 Cost by Service (Last 7 days):"
aws ce get-cost-and-usage \
    --time-period Start=$WEEK_AGO,End=$TODAY \
    --granularity DAILY \
    --metrics BlendedCost \
    --group-by Type=SERVICE \
    --query 'ResultsByTime[0].Groups[?Metrics.BlendedCost.Amount>`0.01`].{Service:Keys[0],Cost:Metrics.BlendedCost.Amount}' \
    --output table 2>/dev/null || echo "Data not available yet"
echo ""

# Forecast
echo "🔮 Forecasted Monthly Cost:"
FIRST_DAY=$(date -u +%Y-%m-01)
LAST_DAY=$(date -u -d "$(date +%Y-%m-01) +1 month -1 day" +%Y-%m-%d 2>/dev/null || date -u -v1d -v+1m -v-1d +%Y-%m-%d)

aws ce get-cost-forecast \
    --time-period Start=$TODAY,End=$LAST_DAY \
    --metric BLENDED_COST \
    --granularity MONTHLY \
    --query 'Total.Amount' \
    --output text 2>/dev/null | xargs printf "\$%.2f\n" || echo "Not enough data for forecast"
echo ""

# Budget recommendations
echo "💡 Cost Optimization Tips:"
echo "   • Current setup: Serverless (no idle costs)"
echo "   • Lambda: Only charged when invoked"
echo "   • DynamoDB: On-demand pricing"
echo "   • S3: Pay for storage only"
echo ""
echo "🛑 To stop all costs:"
echo "   cd infrastructure && cdk destroy"
echo ""
