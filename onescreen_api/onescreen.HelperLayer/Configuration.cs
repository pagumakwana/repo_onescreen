using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace webdHelper
{
    internal static class Configuration
    {
        const string DEFAULT_CONNECTION_KEY = "DefaultConnection";

        public static string DefaultConnection
        {
            get
            {
                return ConfigurationManager.AppSettings[DEFAULT_CONNECTION_KEY];
            }
        }

        public static string ProviderName
        {
            get
            {
                return ConfigurationManager.ConnectionStrings[DefaultConnection].ProviderName;
            }
        }

        public static string ConnectionString
        {
            get
            {
                return ConfigurationManager.ConnectionStrings[DefaultConnection].ConnectionString;
            }
        }

        public static string GetConnectionString(string connectionName)
        {
            return ConfigurationManager.ConnectionStrings[connectionName].ConnectionString;
        }

        public static string GetProviderName(string connectionName)
        {
            return ConfigurationManager.ConnectionStrings[connectionName].ProviderName;
        }

    }

}
