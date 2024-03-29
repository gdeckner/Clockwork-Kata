﻿using System;
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
            var serverTime = TimeZoneInfo.ConvertTimeFromUtc(utcTime, TimeZoneInfo.FindSystemTimeZoneById(timeZoneId));
            var ip = this.HttpContext.Connection.RemoteIpAddress.ToString();
            var returnVal = new CurrentTimeQuery
            {
                UTCTime = utcTime,
                TimeZone = timeZoneId,
                ClientIp = ip,
                Time = serverTime

            };
            


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
        //Retrieves all the database entries and returns it
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
        [Route("api/[controller]/timeZoneList")]
        [HttpGet]
        //Gets a list of time zones and returns it
        public IActionResult TimeZonesList()
        {
            var returnVals = TimeZoneInfo.GetSystemTimeZones();

            return Ok(returnVals);
        }
        [Route("api/[controller]/setLocalTimeZone")]
        [HttpGet]
        //Retrieves the local time zone of the client computer to set the default time zone for the list.
        public IActionResult SetLocalTimeZone()
        {
            var returnVals = TimeZoneInfo.Local.StandardName;

            return Ok(returnVals);
        }
       
    }
}
