using System;
using Microsoft.AspNetCore.Mvc;
using Clockwork.API.Models;
using System.Collections.Generic;

namespace Clockwork.API.Controllers
{

    public class CurrentTimeController : Controller

    {
        [Route("api/[controller]")]
        // GET api/currenttime
        [HttpGet]
        public IActionResult Get(string timeZoneId)
        {

            var utcTime = DateTime.UtcNow;
            var localTimeZone = TimeZoneInfo.Local;
            var serverTime = DateTime.Now;
            var ip = this.HttpContext.Connection.RemoteIpAddress.ToString();
            var returnVal = new CurrentTimeQuery
            {
                UTCTime = utcTime,
                TimeZone = localTimeZone.StandardName,
                ClientIp = ip,
                Time = serverTime

            };
            if (timeZoneId != null)
            {
                returnVal.Time = TimeZoneInfo.ConvertTimeFromUtc(utcTime,TimeZoneInfo.FindSystemTimeZoneById(timeZoneId));
                returnVal.TimeZone = timeZoneId;
            }


            using (var db = new ClockworkContext())
            {
                db.CurrentTimeQueries.Add(returnVal);
                var count = db.SaveChanges();
                Console.WriteLine("{0} records saved to database", count);

                Console.WriteLine();
                foreach (var CurrentTimeQuery in db.CurrentTimeQueries)
                {
                    Console.WriteLine(" - {0}", CurrentTimeQuery.UTCTime);
                }
            }

            return Ok(returnVal);
        }
        //GET api/pullTimes
        [Route("api/[controller]/pullTimes")]
        [HttpGet]
        public IActionResult PullTimes()
        {
            var returnVals = new List<CurrentTimeQuery>();
            using (var db = new ClockworkContext())
            {
                foreach (var currentTimeQuery in db.CurrentTimeQueries)
                {
                    returnVals.Add(currentTimeQuery);
                }
            }
            return Ok(returnVals);
        }
    }
}
